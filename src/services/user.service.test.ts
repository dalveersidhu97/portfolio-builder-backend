import { describe, expect, test } from '@jest/globals';
import mongoose from 'mongoose';
import { User, UserSkillsModel, UsersSkillsGroupsModel } from '../models';
import { SkillService } from './skills.service';
import { UserService } from './user.service';

beforeEach(async () => {
	await mongoose.connect('mongodb://localhost:27017/test')
	await User.remove({}); // clear user collection
	await UsersSkillsGroupsModel.remove({});
	await UserSkillsModel.remove({});
});

afterEach(async () => {
	await mongoose.disconnect()
});

describe('User service', () => {
	test('it should create a user', async () => {
		const user = {
			name: 'Dalveer',
			email: 'test@gmail.com',
			about: 'Test about',
		}
		const newUser = await UserService.createUser(user);
        expect(newUser).toEqual(expect.objectContaining(user));
	});
    test('it should create a skill group', async () => {
		const user = {
			name: 'Dalveer',
			email: 'test@gmail.com',
			about: 'Test about',
		}
		const newUser = await UserService.createUser(user);
        expect(newUser).toEqual(expect.objectContaining(user));

        const group = { name: 'Front-End', userId: newUser.id.toString() };
        const newGroup = await SkillService.addSkillGroup({ groupName: group.name, userId: group.userId });
        expect({name: newGroup.name, userId: newGroup.userId?.toString()}).toEqual(expect.objectContaining(group));

	});
    test('it should create a skill inside skill group', async () => {
		const user = {
			name: 'Dalveer',
			email: 'test@gmail.com',
			about: 'Test about',
		}
		const newUser = await UserService.createUser(user); // create user
        expect(newUser).toEqual(expect.objectContaining(user));

        const group = { name: 'Front-End', userId: newUser.id.toString() };
        const newGroup = await SkillService.addSkillGroup({ groupName: group.name, userId: group.userId }); // create skill group
        expect({name: newGroup.name, userId: newGroup.userId?.toString()}).toEqual(expect.objectContaining(group));

        const skill = { label: 'HTML & CSS', score: 90, userId: newUser.id.toString(), groups: [newGroup.id.toString()] };
        const newSkill = await SkillService.addSkill({ ...skill, groupIds: skill.groups });
        expect({
            label: newSkill.label,
            score: newSkill.score,
            groups: newSkill.groups.map(grpId => grpId.toString()),
            userId: newSkill.userId?.toString()
        }).toEqual(expect.objectContaining(skill))
	});
});