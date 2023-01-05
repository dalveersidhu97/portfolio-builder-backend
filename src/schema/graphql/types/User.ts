import { inputObjectType, interfaceType, objectType } from "nexus"
import { SummaryModel } from "../../../models"
import { SkillService, UserService } from "../../../services"

export const UserInputType = inputObjectType({
    name: 'UserInput',
    definition(t) {
        t.nonNull.string('name')
        t.nonNull.string('email')
        t.nonNull.string('password')
        t.nonNull.string('confirmPassword')
        t.nonNull.string('about', { default: '' })
        t.nonNull.string('phone', { default: '' })
        t.nonNull.string('address', { default: '' })
        t.nonNull.string('picture', { default: '' })
        t.nonNull.string('resume', { default: '' })
        t.nonNull.string('linkedin', { default: '' })
        t.nonNull.string('facebook', { default: '' })
        t.nonNull.string('github', { default: '' })
    }
})

export const UpdateUserInput = inputObjectType({
    name: 'UpdateUserInput',
    definition(t) {
        t.nullable.string('name')
        t.nullable.string('password')
        t.nullable.string('confirmPassword')
        t.nullable.string('email')
        t.nullable.string('about')
        t.nullable.string('phone')
        t.nullable.string('address')
        t.nullable.string('picture')
        t.nullable.string('resume')
        t.nullable.string('linkedin')
        t.nullable.string('facebook')
        t.nullable.string('github')
    }
})

export const SummariesInputType = inputObjectType({
    name: 'SummariesInput',
    definition(t) {
        t.nullable.string('skills')
        t.nullable.string('about')
        t.nullable.string('education')
        t.nullable.string('resume')
        t.nullable.string('work')
        t.nullable.string('projects')
    }
})

export const SummariesType = objectType({
    name: 'Summaries',
    definition(t) {
        t.nullable.string('skills')
        t.nullable.string('about')
        t.nullable.string('education')
        t.nullable.string('resume')
        t.nullable.string('work')
        t.nullable.string('projects')
    }
})

export const SimpleUserType = objectType({
    name: 'SimpleUser',
    definition(t) {
        t.nonNull.id('id')
        t.nonNull.string('name')
        t.nonNull.string('email')
        t.nonNull.string('about')
        t.nonNull.string('phone')
        t.nonNull.string('address')
        t.nonNull.string('picture')
        t.nonNull.string('resume')
        t.nonNull.string('linkedin')
        t.nonNull.string('facebook')
        t.nonNull.string('github')
    }
});

export const UserType = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.id('id')
        t.nonNull.string('name')
        t.nonNull.string('email')
        t.nullable.string('about')
        t.nullable.string('phone')
        t.nullable.string('address')
        t.nullable.string('picture')
        t.nullable.string('resume')
        t.nullable.string('linkedin')
        t.nullable.string('facebook')
        t.nullable.string('github')
    },
})