import mongoose, { Schema } from "mongoose";
const { Types: { String, Boolean, ObjectId, Number } } = Schema;

const UsersSkillsGroups = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        require: true
    },
    name: { type: String, require: true }
});
export const UsersSkillsGroupsModel = mongoose.model('UsersSkillGroups', UsersSkillsGroups);

const UserSkillSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', require: true },
    label: { type: String, require: true },
    score: { type: Number, require: true },
    groups: { type: [ObjectId], ref: 'UsersSkillGroups', require: true }
});
export const UserSkillsModel = mongoose.model('UserSkill', UserSkillSchema);

const SummarySchema = new Schema({
    userId: { type: ObjectId, ref: 'User', require: true },
    skills: { type: String, default: '' },
    about: { type: String, default: '' },
    education: { type: String, default: '' },
    resume: { type: String, default: '' },
    work: { type: String, default: '' },
    projects: { type: String, default: '' }
});
export const SummaryModel = mongoose.model('Summaries', SummarySchema);

const UserSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    phone: { type: String, require: true, default: '' },
    address: { type: String, require: true, default: '' },
    about: { type: String, require: true, default: '' },
    resume: { type: String, require: true, default: '' },
    picture: { type: String, require: true, default: '' },
    
    linkedin: { type: String, require: true, default: '' },
    facebook: { type: String, require: true, default: '' },
    github: { type: String, require: true, default: '' },
});

export const User = mongoose.model('User', UserSchema);