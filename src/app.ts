import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { schema } from './schema';
import { ContextType } from './types';
import cookieParser from 'cookie-parser';
import { AuthService, OAuthService, UserService } from './services';
import { config } from '../config';

export class App {
    public app: Express;

    constructor() {
        this.app = express();
    }

    private async connectDB() {
        await mongoose.connect(config.MONGODB_URI)
        console.log('MongoDB Connected!');
    }

    private applyMiddlewares() {
        this.app.use(cookieParser()),
            this.app.use(express.json({ limit: '50mb' }))
        this.app.use(cors<cors.CorsRequest>({
            origin: [config.REACT_APP_URL, 'http://192.168.0.85:3000'],
            credentials: true,
        }))
    }

    private async setUpOAuth() {
        await OAuthService.setUpPassport(this.app);
    }

    private async applyGraphQLMiddleware(apolloServer: ApolloServer<ContextType>) {
        // Express GraphQL Middleware
        this.app.use(
            '/',
            expressMiddleware<ContextType>(apolloServer, {
                context: async ({ req, res }) => {
                    const user = await AuthService.verifyLogin(req);
                    return {
                        user,
                        req,
                        res,
                    }
                },
            }),
        );
    }

    public async start() {
        await this.connectDB();
        this.applyMiddlewares();
        await this.setUpOAuth();
        const httpServer = http.createServer(this.app);
        const apolloServer = new ApolloServer<ContextType>({ schema, plugins: [ApolloServerPluginDrainHttpServer({ httpServer })] });
        await apolloServer.start();
        await this.applyGraphQLMiddleware(apolloServer);

        // Modified server startup
        await new Promise<void>((resolve) => httpServer.listen({ port: config.API_PORT }, resolve));
        console.log(`🚀 Server ready at ${config.API_URL}`);
    }
}