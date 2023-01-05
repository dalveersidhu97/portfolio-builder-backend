import { inputObjectType, interfaceType, objectType } from "nexus";

export const PageInputType = inputObjectType({
    name: 'PageInput',
    definition(t) {
        t.nullable.string('title')
        t.nullable.string('summary')
        t.nonNull.string('name')
    }
})

export const PageInterfaceType = interfaceType({
    name: 'PageInterface',
    definition(t) {
        t.nonNull.id('id'),
        t.nonNull.id('userId'),
        t.nullable.string('title')
        t.nullable.string('summary'),
        t.nonNull.string('name')
    },
    resolveType: (source, context, info, abstractType) => {
        const page = source.name.toLocaleLowerCase();
        if ( page === 'experience') return 'Experience';
        if (page === 'about') return 'AboutPage';
        if (page === 'education') return 'EducationPage';
        if (page === 'skills') return 'Skills';
        return 'Page';
    }
});

export const PageType = objectType({
    name: 'Page',
    definition(t) {
        t.implements('PageInterface')
    },
});
