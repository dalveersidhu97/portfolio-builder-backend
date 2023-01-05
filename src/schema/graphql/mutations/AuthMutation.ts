import { arg, extendType, nonNull, stringArg } from "nexus";
import { AuthService, UserService } from "../../../services";
import { ContextType } from "../../../types";

export const AuthMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('login', {
            type: 'Response',
            args: { credentials: nonNull(arg({ type: 'LoginInput' })) },
            resolve: async (_parent, { credentials }, ctx: ContextType) => {
                const login = await AuthService.login(credentials);
                const success = !!login && !!login.accessToken;
                const res = { success, login: null, user: null };
                if (success) {
                    AuthService.setRefreshTokenCookie(login.refreshToken, ctx.res);
                    res.login = login;
                    res.user = UserService.getPlaneUser(login.user)
                }
                return res;
            },
        })
        t.nonNull.field('logout', {
            type: 'ResponseType',
            resolve: async (_parent, _args, ctx: ContextType) => {
                AuthService.logout(ctx);
                return { success: true }
            },
        })
        t.nonNull.field('refereshToken', {
            type: 'Response',
            resolve: async (_parent, _args, ctx: ContextType) => {
                const refreshToken = ctx.req.cookies['refreshToken'];
                if (!!refreshToken) {
                    const login = await AuthService.refreshToken(refreshToken);
                    const success = !!login && !!login.accessToken;
                    if (!success) return { success: false };
                    AuthService.setRefreshTokenCookie(login.refreshToken, ctx.res);
                    return { success, login: { ...login, user: UserService.getPlaneUser(login.user) } }
                }
                return { success: false }
            },
        })
    },
});