import { arg, extendType, nonNull, stringArg } from "nexus";
import { requireLogin, UserService } from "../../../services";
import { ContextType } from "../../../types";

export const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createUser', {
            type: 'Response',
            args: { user: arg({ type: 'UserInput' }) },
            resolve: (async (_root, { user }) => {
                const { password, confirmPassword } = user;
                if (password) {
                    if (!password || password.length < 8) 
                        throw new Error('Password must be atleast 8 characters long');
                    if (confirmPassword !== password) throw new Error('Passwords do not match');
                }
                let userAttr = {
                    about: user.about,
                    address: user.address,
                    email: user.email,
                    facebook: user.facebook,
                    github: user.github,
                    linkedin: user.linkedin,
                    name: user.name,
                    password: user.password, // TODO: Encrypt Password
                    phone: user.phone,
                    picture: user.picture,
                    resume: user.resume
                 };
                const createdUser = await UserService.createUser(userAttr);
                return {
                    success: true,
                    user: UserService.getPlaneUser(createdUser)
                }
            })
        })
        t.field('updateUser', {
            type: 'Response',
            args: { updateAttributes: nonNull(arg({ type: 'UpdateUserInput' })) },
            resolve: requireLogin(async (_root, { updateAttributes }, ctx: ContextType) => {
                const { password, confirmPassword } = updateAttributes;
                if (password) {
                    if (!password || password.length < 8) 
                        throw new Error('Password must be atleast 8 characters long');
                    if (confirmPassword !== password) throw new Error('Passwords do not match');
                }
                const updatedUser = await UserService.updateUserById(ctx.user!.id, updateAttributes);
                if (!updatedUser) return { success: false }
                return {
                    success: true,
                    user: UserService.getPlaneUser(updatedUser)
                }
            })
        })
    },
});