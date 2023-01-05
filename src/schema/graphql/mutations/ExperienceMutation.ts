import { arg, extendType, idArg, nonNull, stringArg } from "nexus";
import { ExperienceService, requireLogin } from "../../../services";
import { ContextType } from "../../../types";

export const ExperienceMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('addWork', {
            args: { 
                workAttributes: nonNull(arg({ type: 'WorkInput' })),
            },
            type: 'Response',
            resolve: requireLogin(async (parent, { workAttributes }, context: ContextType) => {
                const work = await ExperienceService.addWork(context.user!.id, workAttributes);
                const payload = ExperienceService.createWorkPayload(work);
                return {
                    success: !!payload,
                    work: payload
                }
            })
        })
        t.nullable.field('updateWork', {
            args: { 
                workId: nonNull(idArg()),
                workAttributes: nonNull(arg({ type: 'UpdateWorkInput' })),
            },
            type: 'Response',
            resolve: requireLogin(async (parent, { workAttributes, workId }, context: ContextType) => {
                const work = await ExperienceService.updateWork(context.user!.id, workId, workAttributes);
                const payload = ExperienceService.createWorkPayload(work);
                return {
                    success: !!payload,
                    work: payload
                }
            })
        })
        t.nullable.field('addProject', {
            args: { 
                projectAttributes: nonNull(arg({ type: 'ProjectInput' })),
            },
            type: 'Response',
            resolve: requireLogin(async (parent, { projectAttributes }, context: ContextType) => {
                const project = await ExperienceService.addProject(context.user!.id, projectAttributes);
                const payload = ExperienceService.createProjectPayload(project);
                return {
                    success: !!payload,
                    project: payload
                }
            })
        })
        t.nullable.field('updateProject', {
            args: { 
                projectId: nonNull(idArg()),
                projectAttributes: nonNull(arg({ type: 'UpdateProjectInput' })),
            },
            type: 'Response',
            resolve: requireLogin(async (parent, { projectAttributes, projectId }, context: ContextType) => {
                const project = await ExperienceService.updateProject(context.user!.id, projectId, projectAttributes);
                const payload = ExperienceService.createProjectPayload(project);
                return {
                    success: !!payload,
                    project: payload
                }
            })
        })
    },
});