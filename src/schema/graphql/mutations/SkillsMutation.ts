import { arg, extendType, idArg, nonNull, stringArg } from "nexus";
import { requireLogin, SkillService } from "../../../services";
import { ContextType } from "../../../types";

export const SkillsMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createSkillGroup', {
            type: 'SkillGroupResponse',
            args: { 
                group: nonNull(arg({ type: 'SkillGroupInput' })),
            },
            resolve: requireLogin(async (_parent, { group }, ctx: ContextType) => {
                const newGroup = await SkillService.addSkillGroup({ userId: ctx.user!.id, groupName: group.name });
                if (!newGroup) return { success: false };
                const createdGroup = {
                    id: newGroup.id.toString()!,
                    name: newGroup.name!
                }
                return {
                    success: true,
                    group: createdGroup
                }
            })
        })
        t.field('updateSkillGroup', {
            type: 'SkillGroupResponse',
            args: { 
                group: nonNull(arg({ type: 'SkillGroupInput' })), 
                groupId: nonNull(idArg()),
            },
            resolve: requireLogin(async (_parent, { group, groupId }, ctx: ContextType) => {
                const updatedGroup = await SkillService.updateSkillGroup({ userId: ctx.user!.id, updateAttributes: group, groupId });
                if (!updatedGroup) return { success: false };
                return {
                    success: true,
                    group: {
                        id: updatedGroup.id.toString()!,
                        name: updatedGroup.name!
                    }
                }
            })
        })

        t.field('createGroupSkill', {
            type: 'SkillResponse',
            args: { 
                skill: nonNull(arg({ type: 'AddGroupSkillInput' })),
            },
            resolve: requireLogin(async (_parent, { skill: { groups, label, score } }, ctx: ContextType) => {
                const newSkill = await SkillService.addSkill({ groupIds: groups, label, score, userId: ctx.user!.id });
                if (!newSkill) return { success: false };
                const skill = {
                    id: newSkill.id.toString()!,
                    label: newSkill.label!,
                    score: newSkill.score!,
                    userId: newSkill.userId!.toString()
                }
                return {
                    success: true,
                    skill
                }
            })
        })

        t.field('updateSkill', {
            type: 'SkillResponse',
            args: { 
                skill: nonNull(arg({ type: 'UpdateGroupSkillInput' })),
                skillId: nonNull(idArg()),
            },
            resolve: requireLogin(async (_parent, { skillId, skill: updateAttributes }, ctx: ContextType) => {
                const updatedSkill = await SkillService.updateSkill({ skillId, userId: ctx.user!.id, updateAttributes });
                return {
                    success: true,
                    skill: {
                        id: updatedSkill.id.toString()!,
                        label: updatedSkill.label!,
                        score: updatedSkill.score!,
                        userId: updatedSkill.userId!.toString()!
                    }
                }
            })
        })
    },
});