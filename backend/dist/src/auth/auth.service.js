"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const SALT_ROUNDS = 10;
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                role: dto.restaurantId ? client_1.Role.RESTAURANT_ADMIN : client_1.Role.RESTAURANT_ADMIN,
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
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async refresh(refreshToken) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!stored || stored.expiresAt < new Date()) {
            if (stored)
                await this.prisma.refreshToken.delete({ where: { id: stored.id } });
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
        return this.issueTokens(stored.user.id, stored.user.email, stored.user.role, stored.user.restaurantId ?? undefined);
    }
    async logout(refreshToken) {
        await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    async validateUserById(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, restaurantId: true },
        });
    }
    async issueTokensForUser(userId) {
        const user = await this.validateUserById(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return this.issueTokens(user.id, user.email, user.role, user.restaurantId ?? undefined);
    }
    async issueTokens(userId, email, role, restaurantId) {
        const payload = { sub: userId, email, role, restaurantId };
        const accessExpiry = this.config.get('JWT_ACCESS_EXPIRY', '15m');
        const refreshExpiry = this.config.get('JWT_REFRESH_EXPIRY', '7d');
        const accessToken = this.jwt.sign(payload, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: accessExpiry,
        });
        const refreshToken = (0, uuid_1.v4)();
        const refreshExpiresAt = new Date();
        const days = parseInt(refreshExpiry.replace('d', ''), 10) || 7;
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + days);
        await this.prisma.refreshToken.create({
            data: { token: refreshToken, userId, expiresAt: refreshExpiresAt },
        });
        const decoded = this.jwt.decode(accessToken);
        const expiresIn = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 900;
        return { accessToken, refreshToken, expiresIn };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map