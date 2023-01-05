import mongoose, { Document } from "mongoose";
import { ProjectModel, WorkModel } from "../models";
import { NexusGenInputs, NexusGenObjects } from "../schema/nexus-typegen";
import { IdType } from "../types";
import { updateModel } from "../utils/model.helpers";

type WorkDoctype = Partial<Omit<NexusGenObjects['Work'], 'id'>>;
type WorkDocument = Document<any, any, WorkDoctype> & WorkDoctype & {id?: mongoose.Types.ObjectId};
type ProjectDoctype = Partial<Omit<NexusGenObjects['Project'], 'id'>>;
type ProjectDocument = Document<any, any, ProjectDoctype> & ProjectDoctype & {id?: mongoose.Types.ObjectId};


export class ExperienceService {
    public static async addWork (userId: IdType, workAttributes: NexusGenInputs['WorkInput']) {
        const work = await WorkModel.create({ userId, ...workAttributes })
        return work;
    }
    public static async updateWork (userId: IdType, workId: IdType, workAttributes: NexusGenInputs['UpdateWorkInput']) {
        const existingWork = await WorkModel.findOne({ userId, _id: workId });
        const updatedWork = await updateModel(existingWork, workAttributes);
        return updatedWork;
    }
    public static async getWorks (userId: IdType) {
        const works = await WorkModel.find({ userId });
        return works
    }
    public static async addProject (userId: IdType, projectAttributes: NexusGenInputs['ProjectInput']) {
        const project = await ProjectModel.create({ userId, ...projectAttributes })
        return project;
    }
    public static async updateProject (userId: IdType, projectId: IdType, projectAttributes: NexusGenInputs['UpdateProjectInput']) {
        const existingProject = await ProjectModel.findOne({ userId, _id: projectId });
        const updatedWork = updateModel(existingProject, projectAttributes);
        return updatedWork;
    }
    public static async getProjects (userId: IdType) {
        const projects = await ProjectModel.find({ userId });
        return projects
    }
    public static createWorkPayload(work: WorkDocument | null) {
        if (!work) return null;
        return {
            id: work.id.toString() as string,
            address: work.address!,
            company: work.company!,
            duration: work.duration!,
            duties: work.duties!,
            role: work.role!,
            type: work.type!,
            icon: work.icon,
        }
    }
    public static createProjectPayload(project: ProjectDocument|null) {
        if(!project) return null;
        return {
            id: project.id.toString() as string,
            deployed: project.deployed!,
            desc: project.desc!,
            github: project.github!,
            images: project.images!,
            skills: project.skills,
            label: project.label
        }
    }
}