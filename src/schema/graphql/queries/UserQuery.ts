import { extendType, idArg, nullable, stringArg } from "nexus";
import { UserService } from "../../../services";

export const UserQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: 'User',
            args: { search: nullable(stringArg()) },
            async resolve(parent, { search }) {
                const users = search!==undefined ? await UserService.getMatchingUsers({search}) :  await UserService.getAllUsers();
                return users.map(user => UserService.getPlaneUser(user))
            },
        })
        t.nullable.field('user', {
            type: 'User',
            args: {
                emailOrId: idArg(),
            },
            async resolve(_, { emailOrId }) {
                const user = await UserService.getUserByEmailOrId(emailOrId!);
                if (!user) return null;
                return UserService.getPlaneUser(user);
            },
        })
    },
});