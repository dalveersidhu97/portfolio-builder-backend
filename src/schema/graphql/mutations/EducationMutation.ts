import { arg, extendType, idArg, nonNull, stringArg } from "nexus";
import { EducationService, requireLogin } from "../../../services";
import { ContextType } from "../../../types";

export const EducationMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nullable.field('addEducation', {
            args: { 
                educationAttributes: nonNull(arg({ type: 'EducationInput' })),
            },
            type: 'Response',
            resolve: requireLogin(async (parent, { educationAttributes }, context: ContextType) => {
                const education = await EducationService.addEducation(context.user!.id, educationAttributes);
                const payload = EducationService.createPayload(education);
                return {
                    success: !!payload,
                    education: payload
                }
            })
        })
        t.nullable.field('updateEducation', {
            args: { 
                educationId: nonNull(idArg()),
                educationAttributes: nonNull(arg({ type: 'UpdateEducationInput' })),
            },
            type: 'Response',
            resolve: requireLogin(async (parent, { educationAttributes, educationId }, context: ContextType) => {
                const education = await EducationService.updateEducation(context.user!.id, educationId, educationAttributes);
                const payload = EducationService.createPayload(education);
                return {
                    success: !!payload,
                    education: payload   
                }
            })
        })
    },
});