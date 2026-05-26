import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 10;

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  restaurantId?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.restaurantId ? Role.RESTAURANT_ADMIN : Role.RESTAURANT_ADMIN,
        restaurantId: dto.restaurantId ?? undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        restaurantId: true,
        createdAt: true,
      },
    });

    return this.issueTokens(user.id, user.email, user.role, user.restaurantId ?? undefined);
  }

  async login(dto: LoginDto): Promise<TokenPair & { user: object }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(user.id, user.email, user.role, user.restaurantId ?? undefined);
    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.issueTokens(
      stored.user.id,
      stored.user.email,
      stored.user.role,
      stored.user.restaurantId ?? undefined,
    );
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  async validateUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, restaurantId: true },
    });
  }

  /** Issue new tokens for a user (e.g. after onboarding when restaurantId was set). */
  async issueTokensForUser(userId: string): Promise<TokenPair> {
    const user = await this.validateUserById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return this.issueTokens(user.id, user.email, user.role, user.restaurantId ?? undefined);
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: Role,
    restaurantId?: string,
  ): Promise<TokenPair> {
    const payload: JwtPayload = { sub: userId, email, role, restaurantId };
    const accessExpiry = this.config.get<string>('JWT_ACCESS_EXPIRY', '15m');
    const refreshExpiry = this.config.get<string>('JWT_REFRESH_EXPIRY', '7d');

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessExpiry,
    });

    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date();
    const days = parseInt(refreshExpiry.replace('d', ''), 10) || 7;
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + days);

    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt: refreshExpiresAt },
    });

    const decoded = this.jwt.decode(accessToken) as { exp: number };
    const expiresIn = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 900;

    return { accessToken, refreshToken, expiresIn };
  }
}
