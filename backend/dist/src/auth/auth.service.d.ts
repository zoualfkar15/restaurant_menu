import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<TokenPair>;
    login(dto: LoginDto): Promise<TokenPair & {
        user: object;
    }>;
    refresh(refreshToken: string): Promise<TokenPair>;
    logout(refreshToken: string): Promise<void>;
    validateUserById(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        restaurantId: string | null;
    } | null>;
    issueTokensForUser(userId: string): Promise<TokenPair>;
    private issueTokens;
}
