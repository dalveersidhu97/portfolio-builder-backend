
import mongoose, { mongo, Schema, Types } from "mongoose";
import { User, UserSkillsModel, UsersSkillsGroupsModel } from "../models";
import { NexusGenInputs } from "../schema/nexus-typegen";
import { UserService } from "./user.service";

type IdType = string | Types.ObjectId;

export class SkillService {
    public static async getUserSkillGroups(userId: IdType) {
        const skillGrops = await UsersSkillsGroupsModel.find({ userId });
        return skillGrops;
    }

    public static async getGroupSkills(skillGroupId: IdType) {
        const skills = await UserSkillsModel.find({ groups: { $in: skillGroupId } });
        return skills;
    }
    public static async getSkillGroups(skillId: IdType) {
        const skill = await UserSkillsModel.findById(skillId);
        if (!skill) return [];
        const groupPromises = skill.groups.map(grpId => UsersSkillsGroupsModel.findById(grpId));
        const groups = await Promise.all(groupPromises);
        return groups;
    }

    public static async addSkillGroup({userId, groupName}: { userId: IdType, groupName: string }) {
        const user = await User.findById(userId);
        if (!user) throw new Error('Invalid User ID');
        const existingGroup = await UsersSkillsGroupsModel.findOne({ userId: userId, name: groupName });
        if (existingGroup) throw new Error(`Group with name "${groupName}" already exists`);
        const newGroup = await UsersSkillsGroupsModel.create({ userId: user.id, name: groupName});
        return newGroup;
    }
    public static async updateSkillGroup({userId, groupId, updateAttributes}: { userId: IdType, groupId: IdType, updateAttributes: NexusGenInputs['SkillGroupInput'] }) {
        const user = await UserService.validateUserId(userId);
        const group = await this.validateSkillGroupId(groupId, user.id);
        const keys = Object.keys(updateAttributes) as (keyof typeof updateAttributes)[];
        keys.forEach((key) => {
            if (updateAttributes[key]) group[key] = updateAttributes[key] as any;
        });
        const updatedGroup = await group.save();
        return updatedGroup;
    }

    public static async addSkill(updateAttributes: { label: string, score: number, groupIds: IdType[], userId: IdType }) {
        const { label, score, groupIds, userId } = updateAttributes;
        await UserService.validateUserId(userId);
        const existingSkill = await UserSkillsModel.findOne({ 
            label: { $regex: new RegExp(label, 'i') }, 
            userId, 
        });
        if (existingSkill) {
            const keys = Object.keys(updateAttributes) as (keyof typeof updateAttributes)[];
            keys.forEach((key) => {
                if(key==='groupIds') existingSkill.groups = updateAttributes.groupIds.map(id => new mongoose.Types.ObjectId(id.toString()));
                else existingSkill[key as string] = updateAttributes[key] as any;
            });
            return await existingSkill.save();
        }
        if (groupIds.length === 0) throw new Error('No skill group provided');
        await this.validateSkillGroupIds(groupIds, userId);
        const newSkill = await UserSkillsModel.create({ label, score, groups: groupIds, userId })
        return newSkill;
    }
    public static async updateSkill({ skillId, updateAttributes, userId }: { updateAttributes: NexusGenInputs['AddGroupSkillInput'], skillId: IdType, userId: IdType }) {
        const user = await UserService.validateUserId(userId);
        const skill = await this.validateGroupSkillId(skillId, user.id);
        const keys = Object.keys(updateAttributes) as (keyof typeof updateAttributes)[];
        keys.forEach((key) => {
            if (key === 'groups'){
                if (updateAttributes.groups) skill.groups = updateAttributes.groups.map(grpId => new mongoose.Types.ObjectId(grpId))
            }else if (updateAttributes[key]) skill[key as string] = updateAttributes[key] as any;
        });
        const updatedSkill = await skill.save();
        return updatedSkill;
    }
    public static async validateGroupSkillId(skillId: IdType, userId?: IdType) {
        const isValidId = mongoose.isValidObjectId(skillId);
        if (!isValidId) throw new Error(`Invalid id "${skillId}"`);
        const skill = await UserSkillsModel.findById(skillId);
        if (!skill) throw new Error(`Invalid group "${skillId}"`);
        if (userId && skill.userId?.toString() !== userId.toString())
            throw new Error(`Skill does not belong to user`)
        return skill;
    }
    public static async validateSkillGroupId(groupId: IdType, userId?: IdType) {
        const isValidId = mongoose.isValidObjectId(groupId);
        if (!isValidId) throw new Error(`Invalid id "${groupId}"`);
        const skillGroup = await UsersSkillsGroupsModel.findById(groupId);
        if (!skillGroup) throw new Error(`Invalid group "${groupId}"`);
        if (userId && skillGroup.userId?.toString() !== userId.toString())
            throw new Error(`Group does not belong to user`)
        return skillGroup;
    }
    public static async validateSkillGroupIds(groupIds: IdType[], userId?: IdType) {
        for (let groupId of groupIds) {
            await this.validateSkillGroupId(groupId, userId)
        }
        return true; // TODO: return validated groups
    }
}