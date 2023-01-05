import { arg, extendType, idArg, nonNull, stringArg } from "nexus";
import { requireLogin } from "../../../services";
import { PageService } from "../../../services/page.service";

export const PageQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('page', {
            type: 'PageInterface',
            args: { userId: nonNull(idArg()), pageName: nonNull(stringArg()) },
            resolve: async (parent, { userId, pageName }) => {
                const page = await PageService.getPage(userId, pageName);
                if (!page) return null;
                return {
                    id: page.id.toString(),
                    name: page.name,
                    userId: page.userId!.toString(),
                    summary: page.summary,
                    title: page.title,
                }
            }
        })
    },
});