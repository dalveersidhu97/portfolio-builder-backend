import { interfaceType, objectType } from "nexus";

export const ResponseInterface = interfaceType({
    name: 'Response',
    definition(t) {
        t.boolean('success')
    },
    resolveType: (source: any) => {
        if ( source.login !== undefined ) return 'LoginResponse';
        if (source.user !== undefined ) return 'UserResponse';
        if (source.group !== undefined ) return 'SkillGroupResponse';
        if (source.skill !== undefined ) return 'SkillResponse';
        if (source.deletedCount !== undefined ) return 'DeleteUserResponse';
        if (source.education !== undefined ) return 'EducationResponse';
        if (source.work !== undefined ) return 'WorkResponse';
        if (source.project !== undefined ) return 'ProjectResponse';
        if (source.page !== undefined ) return 'PageResponse';
        return 'ResponseType'
    }
})

export const ResponseType = objectType({
    name: 'ResponseType',
    definition(t) {
        t.implements('Response')
    }
})

export const LoginResponseType = objectType({
    name: 'LoginResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('login', {
            type: 'Login'
        }) 
    }
});

export const UserResponseType = objectType({
    name: 'UserResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('user', {
            type: 'User'
        })
    }
});

export const SkillGroupResponseType = objectType({
    name: 'SkillGroupResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('group', {
            type: 'SkillGroup'
        })
    }
});

export const SkillResponseType = objectType({
    name: 'SkillResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('skill', {
            type: 'Skill'
        })
    }
});

export const EducationResponseType = objectType({
    name: 'EducationResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('education', {
            type: 'Education'
        })
    }
});

export const DeleteUserResponseType = objectType({
    name: 'DeleteUserResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.int('deletedCount')
    }
});

export const WorkResponseType = objectType({
    name: 'WorkResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('work', {
            type: 'Work'
        })
    }
});

export const ProjectResponseType = objectType({
    name: 'ProjectResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('project', {
            type: 'Project'
        })
    }
});

export const PageResponseType = objectType({
    name: 'PageResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('page', {
            type: 'Page'
        })
    }
});

export const AboutSectionResponseType = objectType({
    name: 'AboutSectionResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('section', {
            type: 'AboutSection'
        })
    }
});

export const AboutArticleResponseType = objectType({
    name: 'AboutArticleResponse',
    definition(t) {
        t.implements('Response')
        t.nullable.field('article', {
            type: 'AboutArticle'
        })
    }
});
