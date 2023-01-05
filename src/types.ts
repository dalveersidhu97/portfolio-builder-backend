import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';
import { User } from './models/user.model';

export type IdType = mongoose.Types.ObjectId | string;

export type ContextType = {
    user?: (Document<unknown, any, typeof User>) | null,
    req: Request,
    res: Response,
}