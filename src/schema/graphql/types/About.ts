import { inputObjectType, objectType } from "nexus"
import { AboutService } from "../../../services"

export const AboutPageInputType = inputObjectType({
    name: 'AboutPageInput',
    definition(t) {
        t.nullable.string('title')
        t.nullable.string('summary')
    }
})

export const AboutSectionInputType = inputObjectType({
    name: 'AboutSectionInput',
    definition(t) {
        t.nullable.id('id'),
        t.nullable.string('name')
    }
})
export const AboutArticleInputType = inputObjectType({
    name: 'AboutArticleInput',
    definition(t) {
        t.nullable.id('id')
        t.nullable.id('sectionId')
        t.nullable.string('icon')
        t.nullable.string('label')
        t.nullable.string('content')
    }
})

export const AboutPageType = objectType({
    name: 'AboutPage',
    definition(t) {
        t.implements('PageInterface')
        t.nonNull.list.nonNull.field('sections', {
            type: 'AboutSection',
            async resolve({ userId }) {
                const sections = await AboutService.getAboutSectionsByUserId(userId);
                return sections.map((section) => ({ 
                    id: section.id.toString(), 
                    name: section.name,
                }))
            }
        })
    }
});

export const AboutSectionType = objectType({
    name: 'AboutSection',
    definition(t){
        t.nonNull.id('id'),
        t.nonNull.string('name'),
        t.nonNull.list.nonNull.field('articles', {
            type: 'AboutArticle',
            async resolve({ id: sectionId }){
                const articles = await AboutService.getAboutArticlesBySectionId(sectionId);
                return articles.map((article) => ({ 
                    id: article.id.toString(), 
                    label: article.label,
                    content: article.content,
                    sectionId: article.sectionId?.toString()!,
                    icon: article.icon
                }))
            }
        })
    }
})

export const ArticleType = objectType({
    name: 'AboutArticle',
    definition(t) {
        t.nonNull.id('id')
        t.nonNull.id('sectionId')
        t.nonNull.string('icon')
        t.nonNull.string('label')
        t.nonNull.string('content')
    },
});


