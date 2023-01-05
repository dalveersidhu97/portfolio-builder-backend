import { arg, extendType, inputObjectType, interfaceType, objectType } from "nexus"
import { SkillService } from "../../../services"

export const SkillGroupInput = inputObjectType({
    name: 'SkillGroupInput',
    definition(t) {
        t.nonNull.string('name')
    }
})

export const AddGroupSkillInput = inputObjectType({
    name: 'AddGroupSkillInput',
    definition(t) {
        t.nonNull.int('score')
        t.nonNull.string('label')
        t.nonNull.list.nonNull.id('groups')
    }
})
export const UpdateGroupSkillInput = inputObjectType({
    name: 'UpdateGroupSkillInput',
    definition(t) {
        t.nonNull.int('score')
        t.nonNull.string('label')
        t.nonNull.list.nonNull.id('groups')
    }
})

export const SkillsType = objectType({
    name: 'Skills',
    definition(t) {
        t.implements('PageInterface')
        t.nonNull.list.nonNull.field('groups', {
            type: 'SkillGroup',
            async resolve({ userId }) {
                const skillGroups = await SkillService.getUserSkillGroups(userId);
                return skillGroups.map(grp => ({ 
                    id: grp.id.toString()!, 
                    name: grp.name!,
                }))
            }
        })
    }
});

export const SkillGroupType = objectType({
    name: 'SkillGroup',
    definition(t){
        t.nonNull.id('id'),
        t.nonNull.string('name'),
        t.nonNull.list.nonNull.field('skills', {
            type: 'Skill',
            async resolve({ id: groupId }){
                const skills = await SkillService.getGroupSkills(groupId!);
                return skills.map(skill => ({
                    id: skill.id.toString(),
                    label: skill.label!,
                    score: skill.score!,
                    userId: skill.userId!.toString()!
                }));
            }
        })
    }
})

export const SkillType = objectType({
    name: 'Skill',
    definition(t) {
        t.nonNull.id('id')
        t.nonNull.string('userId')
        t.nonNull.int('score')
        t.nonNull.string('label')
        t.nonNull.list.nonNull.field('groups', {
            type: 'SkillGroup',
            async resolve({ id }) {
                const groups = await SkillService.getSkillGroups(id)
                return groups.map(grp => ({
                    id: grp?.id.toString()!,
                    name: grp?.name!
                }))
            } 
        })
    },
});


