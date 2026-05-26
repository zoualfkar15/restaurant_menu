import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    private auth;
    constructor(config: ConfigService, auth: AuthService);
    validate(payload: JwtPayload): Promise<JwtPayload>;
}
export {};
