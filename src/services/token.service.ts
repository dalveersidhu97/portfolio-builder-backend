import { UserDocumentType, UserService } from "./user.service";
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from "../models/refreshToken.model";
import { config } from "../../config";
import { randomUUID } from "crypto";

type JwtPayloadType = { userId: string, email: string, name: string };

export class TokenService {
    private static JWT_KEY = config.JWT_KEY;
    public static readonly REFRESH_TOKEN_EXPIRY_SECS = 60*60*24*14 /*14 days*/; // number of seconds or '1h', '30d' etc. 
    public static readonly ACCESS_TOKEN_EXPIRY_SECS = 60*60 /*1 hour*/; // number of seconds or '1h', '30d' etc.

    public static async generateAccessToken(user: UserDocumentType) {
        const payload = { email: user.email, userId: user.id.toString(), name: user.name };
        const expiresAt = Math.trunc((Date.now() / 1000) + this.ACCESS_TOKEN_EXPIRY_SECS);
        const encoded = jwt.sign(payload, TokenService.JWT_KEY, { algorithm: 'HS256', expiresIn: this.ACCESS_TOKEN_EXPIRY_SECS });
        return { accessToken: encoded, expiresAt };
    }
    public static async verifyAccessToken(accessToken: string) {
        try {
            const payload = jwt.verify(accessToken, this.JWT_KEY) as JwtPayloadType;
            return payload
        }catch(err) {
            return false
        }
    }
    public static async generateRefreshToken(user: UserDocumentType, ) {
        const randomstr = randomUUID();
        const randomKey = TokenService.JWT_KEY+randomstr; // Generate long random key
        const payload = { email: user.email, userId: user.id.toString(), name: user.name };
        const expiresAt = Math.trunc((Date.now() / 1000) + this.REFRESH_TOKEN_EXPIRY_SECS);
        const encoded = jwt.sign(payload, randomKey, { algorithm: 'HS256', expiresIn: this.REFRESH_TOKEN_EXPIRY_SECS });
        const token = await RefreshTokenModel.create({ userId: user.id, refreshToken: encoded });
        return { refreshToken: token.refreshToken, expiresAt };
    }
    public static async invalidateRefreshToken(user: UserDocumentType, oldRefreshToken: string) {
        const oldToken = await RefreshTokenModel.findOne({ userId: user.id, refreshToken: oldRefreshToken });
        if (!oldToken) return false;
        await oldToken.remove();
        return true;
    }
    /**
     * 
     * @param refreshToken 
     * @returns new refresh token
     */
    public static async verifyRefreshToken(refreshToken: string) {
        // 1: Check if token exist in db
        const token = await RefreshTokenModel.findOne({ refreshToken });
        if (!token) return false;
        const user = await UserService.getUserById(token.userId);
        if (!user) {
            await RefreshTokenModel.remove({ refreshToken })
            return false;
        } 
        // 2: Invalidate RefreshToken as it has been used
        const invalidated = await this.invalidateRefreshToken(user, token.refreshToken);
        if (!invalidated) {
            throw new Error('Unauthorized')
        }
        // 3: Genrate New RefreshToken
        const newRefreshToken = await this.generateRefreshToken(user);
        return {newRefreshToken, user};
    }
}