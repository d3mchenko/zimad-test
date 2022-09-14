import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from 'express';
import { Injectable } from "@nestjs/common";

export class JwtPayload {
    userId: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RefreshTokenStrategy.extractJWT,
            ]),
            secretOrKey: process.env.REFRESH_TOKEN,
            passReqToCallback: true
        });
    }

    validate(req: Request ,payload: JwtPayload) {
        const refreshToken = req.cookies?.refreshToken;

        return { userId: payload.userId, refreshToken }
    }

    private static extractJWT(req: Request): string | null {
        if (
            req.cookies?.refreshToken
        ) {
            return req.cookies.refreshToken;
        }
        return null;
    }
}