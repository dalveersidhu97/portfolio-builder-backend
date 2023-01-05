import mongoose, { Document, Schema, Types } from "mongoose";
import { SummaryModel, User } from "../models";
import { NexusGenInputs } from "../schema/nexus-typegen";
import { updateModel } from "../utils/model.helpers";

type IdType = string | Types.ObjectId;
type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
export type UserDocumentType = Unpromise<ReturnType<typeof UserService.getUserById>>;

export class UserService {
    public static async getAllUsers() {
        const users = await User.find();
        return users;
    }
    public static async getMatchingUsers({search}: { search: string }) {
        const users = await User.find({ $or: [
            { name: { $regex: '^'+search, $options: 'i' } },
            { email: { $regex: '^'+search, $options: 'i' } }
        ] });
        return users;
    }
    public static async getUserByEmail(email: string) {
        const user = await User.findOne({ email: email.toLocaleLowerCase().trim() });
        return user;
    }
    public static async getUserById(userId: IdType) {
        const user = await User.findById(userId);
        return user;
    }
    public static async getUserByEmailOrId(emailOrId: string | IdType) {
        const isValidId = mongoose.isValidObjectId(emailOrId);
        if (isValidId){
            return await User.findById(emailOrId);
        }else if(typeof emailOrId === 'string') {
            return await User.findOne({ email: emailOrId.toLocaleLowerCase() })
        }
        return null;
    }

    public static async createUser (user: Omit<NexusGenInputs['UserInput'], 'confirmPassword'>) {
        const existingUser = await this.getUserByEmail(user.email);
        if (existingUser) throw new Error('User already exists');
        const newUser = await User.create({ ...user, email: user.email.toLocaleLowerCase() });
        return newUser;
    }
    public static deleteUserById (userId: string) {
        return 1
    }

    public static async updateOrAddSumaries(userId: IdType, summaries: NexusGenInputs['SummariesInput']) {
        await this.validateUserId(userId);
        let summary = await SummaryModel.findOne({ userId });
        if (!summary) {
            summary = await SummaryModel.create({ userId, ...summaries });
            return;
        }else {
            const keys = Object.keys(summaries) as (keyof typeof summaries)[];
            keys.forEach((key) => {
                if (summaries[key] !== undefined) summary![key] = summaries[key] as any;
            });
            summary = await summary.save();
        }
        return summary
    }

    public static async updateUserById (userId: IdType, updateAttributes: NexusGenInputs['UpdateUserInput']) {
        const user = await this.validateUserId(userId);
        const updatedUser = await updateModel(user, updateAttributes);
        return updatedUser
    }
    public static async validateUserId(id: IdType) {
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) throw new Error(`Invalid id "${id}"`);
        const user = await this.getUserById(id);
        if (!user) throw new Error(`Invalid user "${id}"`);
        return user;
    }
    public static getPlaneUser(user: Unpromise<ReturnType<typeof this.getUserById>>) {
        if (!user) return null;
        return {
            id: user.id.toString()!,
            name: user.name!,
            email: user.email!,
            about: user.about!,
            phone: user.phone!,
            address: user.address!,
            picture: user.picture!,
            resume: user.resume!,
            linkedin: user.linkedin!,
            facebook: user.facebook!,
            github: user.github!,
        }
    }
}