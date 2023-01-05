import mongoose, { Document } from "mongoose";
import { EducationModel } from "../models";
import { NexusGenInputs, NexusGenObjects, NexusGenTypes } from "../schema/nexus-typegen";
import { IdType } from "../types";
import { updateModel } from "../utils/model.helpers";

type EducationDoctype = Partial<Omit<NexusGenObjects['Education'], 'id'>>;
type EducationDocument = Document<any, any, EducationDoctype> & EducationDoctype & {id?: mongoose.Types.ObjectId};

export class EducationService {
    public static async addEducation (userId: IdType, educationAttrs: NexusGenInputs['EducationInput']) {
        const edu = await EducationModel.create({ userId, ...educationAttrs })
        return edu;
    }
    public static async updateEducation (userId: IdType, eduId: IdType, educationAttrs: NexusGenInputs['UpdateEducationInput']) {
        const existingEdu = await EducationModel.findOne({ userId, _id: eduId });
        const updatedEdu = await updateModel(existingEdu, educationAttrs);
        return updatedEdu;
    }
    public static async getEducations (userId: IdType) {
        const educations = await EducationModel.find({ userId });
        return educations
    }
    public static createPayload(education: EducationDocument|null) {
        if (!education) return null
        return {
            id: education.id.toString(),
            campus: education.campus!,
            course: education.course!,
            duration: education.duration!,
            endDate: education.endDate!,
            gpa: education.gpa!,
            institute: education.institute!,
            startDate: education.startDate!,
            level: education.level!
        }
    }
}