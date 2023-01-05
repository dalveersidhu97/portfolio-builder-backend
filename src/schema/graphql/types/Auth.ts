import { inputObjectType, objectType } from "nexus"

export const LoginInputType = inputObjectType({
    name: 'LoginInput',
    definition(t) {
        t.nonNull.string('email')
        t.nonNull.string('password')
    }
})

export const LoginType = objectType({
    name: 'Login',
    definition(t) {
        t.nonNull.string('accessToken')
        t.nullable.string('refreshToken')
        t.nonNull.int('expiresAt')
        t.nonNull.field('user', { type: 'User' })
    }
});