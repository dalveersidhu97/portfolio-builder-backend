import { arg, extendType, idArg, nonNull, stringArg } from "nexus";
import { AboutService, requireLogin } from "../../../services";
import { ContextType } from "../../../types";

export const AboutMutation = extendType({
    type: 'Mutation',
    definition(t) {
        
        t.field('addOrUpdateAboutSection', {
            type: 'AboutSectionResponse',
            args: { aboutSection: nonNull(arg({ type: 'AboutSectionInput' })) },
            resolve: requireLogin(async (_parent, { aboutSection }, ctx: ContextType) => {
                const section = await AboutService.addOrUpdateAboutSection(ctx.user!.id, aboutSection);
                const payload = {
                    id: section.id.toString(),
                    name: section.name.toString()
                }
                return {
                    success: !!payload,
                    section: payload
                };
            })
        })
        t.field('addOrUpdateAboutArticle', {
            type: 'AboutArticleResponse',
            args: { aboutArticle: nonNull(arg({ type: 'AboutArticleInput' })), sectionId: nonNull(idArg()) },
            resolve: requireLogin(async (_parent, { aboutArticle, sectionId }, ctx: ContextType) => {
                const article = await AboutService.addOrUpdateAboutArticle(ctx.user!.id, sectionId, aboutArticle);
                const payload = {
                    id: article.id.toString(),
                    label: article.label,
                    content: article.content,
                    sectionId: article.sectionId?.toString()!,
                    icon: article.icon
                }
                return {
                    success: !!payload,
                    article: payload
                };
            })
        })
    },
});