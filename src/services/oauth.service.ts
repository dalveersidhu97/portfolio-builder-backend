import passport from 'passport';
import { Express } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { AuthService, TokenService, UserService } from '../services';
import { config } from '../../config';

export class OAuthService {
    public static async setUpPassport (app: Express) {
        app.use(session({ secret: 'SESSION_SECRET' }));
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function (user: any, done) {
            done(null, { ...user._json });
        });
        passport.deserializeUser(async function (user: { email: string }, done) {
            const loggedInUser = await UserService.getUserByEmail(user.email);
            done(null, loggedInUser);
        });
        passport.use(new GoogleStrategy(
            {
                clientID: config.GOOGLE_OAUTH_CLIENT_ID,
                clientSecret: config.GOOGLE_OAUTH_CLIENT_SECRET,
                callbackURL: config.API_URL + '/auth/google/callback'
            },
            async function (accessToken, refreshToken, profile, cb) {
                let user = await UserService.getUserByEmail(profile._json.email);
                if (!user) {
                    user = await UserService.createUser({
                        name: profile._json.name,
                        email: profile._json.email,
                        picture: profile._json.picture,
                        password: 'PASSWORD_IS_NOT_YET', // TODO: link the user to Socials model and set isPasswordSet to false
                        about: '', address: '', facebook: '', github: '', linkedin: '', phone: '', resume: ''
                    })
                }
                return cb(null, profile);
            }
        ));
        app.get('/auth/google', passport.authenticate('google', {
            scope: ['email', 'profile'],
            accessType: 'offline',
            prompt: 'select_account',
            includeGrantedScopes: true,
            failureRedirect: config.REACT_APP_URL,
        }));
        app.get(
            '/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/login' }),
            async function (req, res) {
                const user = req.user as { _json: { email: string } }
                const loggedInUser = await UserService.getUserByEmail(user._json.email);
                const { refreshToken } = await TokenService.generateRefreshToken(loggedInUser);
                // Successful authentication, redirect home.
                AuthService.setRefreshTokenCookie(refreshToken, res)
                res.redirect(config.REACT_APP_URL);
            }
        );
    }
}