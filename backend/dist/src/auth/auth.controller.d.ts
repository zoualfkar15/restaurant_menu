import { AuthService, TokenPair } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { JwtPayload } from './auth.service';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<TokenPair>;
    login(dto: LoginDto): Promise<TokenPair & {
        user: object;
    }>;
    refresh(dto: RefreshTokenDto): Promise<TokenPair>;
    logout(dto: RefreshTokenDto): Promise<{
        message: string;
    }>;
    me(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        restaurantId: string | null;
    } | null>;
}
