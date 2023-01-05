import mongoose, { Schema } from "mongoose";
const { Types: { String, Boolean, ObjectId, Number } } = Schema;

const WorkSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', require: true },
    role: { type: String, require: true },
    company: { type: String, require: true },
    address: { type: String, require: true },
    duration: { type: String, require: true },
    type: { type: String, require: true },
    duties: { type: [String], require: true },
    icon: { type: String, default: '' },
});
export const WorkModel = mongoose.model('Work', WorkSchema);

const ProjectSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', require: true },
    images: { type: [String], require: true },
    label: { type: String, require: true },
    skills: { type: [String], require: true },
    desc: { type: String, require: true },
    github: { type: String, require: true },
    deployed: { type: String, require: true },
});
export const ProjectModel = mongoose.model('Project', ProjectSchema);