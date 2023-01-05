import { arg, extendType, nonNull, stringArg } from "nexus";
import { requireLogin } from "../../../services";
import { PageService } from "../../../services/page.service";
import { ContextType } from "../../../types";

export const PageMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createOrUpdatePage', {
            args: { 
                pageName: nonNull(stringArg()), 
                pageAttributes: nonNull(arg({ type: 'PageInput' })) 
            },
            type: 'Response',
            resolve: requireLogin(async (parent, { pageName, pageAttributes }, context: ContextType) => {
                const page = await PageService.createOrUpdatePage(context.user!.id, pageName, pageAttributes);
                if (!page) return null;
                const payload = {
                    id: page.id.toString(),
                    name: page.name,
                    userId: page.userId!.toString()!,
                    summary: page.summary!,
                    title: page.title!,
                }
                return {
                    success: !!payload,
                    page: payload
                }
            })
        })
    },
});