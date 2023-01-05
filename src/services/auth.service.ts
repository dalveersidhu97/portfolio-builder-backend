import { Request, Response } from "express";
import { User } from "../models";
import { NexusGenInputs } from "../schema/nexus-typegen";
import { ContextType } from "../types";
import { UserDocumentType, UserService } from "./user.service";
import bcrypt from 'bcrypt';
import { TokenService } from "./token.service";

export const requireLogin = <T extends (...a: A) => R, A extends any[], R extends any>(resolveFn: T) => {
    return (...args: A) => {
        const ctx = args[2] as ContextType
        if (!ctx || !ctx.user) throw new Error('Unauthorized');
        return resolveFn(...args);
    }
}

export class AuthService {
    public static async login(credentials: NexusGenInputs['LoginInput']) {
        const user = await User.findOne({ email: credentials.email, password: credentials.password }); 
        if (!user) throw new Error('Invalid email or password!');
        // Generate AccessToken
        const access = await TokenService.generateAccessToken(user);
        const refresh = await TokenService.generateRefreshToken(user);
        return { ...access, user, refreshToken: refresh.refreshToken };
    }
    public static async refreshToken(refreshToken: string) {
        // Verify Refresh Token
        const verfied = await TokenService.verifyRefreshToken(refreshToken)
        if (!verfied) throw new Error('Unauthorized');
        // Generate AccessToken
        const accessToken = await TokenService.generateAccessToken(verfied.user);
        return { user: verfied.user, ...accessToken, refreshToken: verfied.newRefreshToken.refreshToken };
    }
    public static requireLogin = <T extends (...a: A) => R, A extends [any,any,any], R extends any>(resolveFn: T) => {
        return (...args: A) => {
            const ctx = args[2] as ContextType
            if (!ctx || !ctx.user) throw new Error('Unauthorized');
            return resolveFn(...args);
        }
    }
    public static setRefreshTokenCookie(refreshToken: string, res: Response) {
        const refreshTokenExpires = new Date( Date.now() + 1000*TokenService.REFRESH_TOKEN_EXPIRY_SECS );
        const cookieOptions = {
            expires: refreshTokenExpires,
            httpOnly: true,
            path: "/",
            sameSite: true,
            secure: true
        }
        res.cookie('refreshToken', refreshToken, cookieOptions);
        return cookieOptions;
    }
    public static logout (ctx: ContextType) {
        ctx.req.logOut((err) => console.log(err));
        ctx.res.cookie('refreshToken', '', {
            expires: new Date(Date.now() - 900000),
            httpOnly: true,
            path: "/",
        });
        return true;
    }
    public static async verifyLogin(req: Request) {
        if (!req.headers['authorization'])
            return undefined
        else {
            // Verify AccessToken
            const accessToken = req.headers['authorization'];
            const verfied = await TokenService.verifyAccessToken(accessToken);
            if (!verfied) return undefined
            const user = await UserService.getUserById(verfied.userId);
            return user;
        }
    }
}