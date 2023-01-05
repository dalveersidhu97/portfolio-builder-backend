import { AboutArticleModel, AboutPageModel, AboutSectionModel } from "../models";
import { NexusGenInputs } from "../schema/nexus-typegen";
import { IdType } from "../types";

export class AboutService {
    public static async createOrUpdateAboutPage (userId: IdType, aboutPageAttributes: NexusGenInputs['AboutPageInput']) {
        const existingAboutPage = await AboutPageModel.findOne({ userId });
        if (!existingAboutPage) {
            const newAboutPage = await AboutPageModel.create({ userId, ...aboutPageAttributes });
            return newAboutPage;
        }else {
            const keys = Object.keys(aboutPageAttributes) as (keyof typeof aboutPageAttributes)[];
            keys.forEach((key) =>{
                existingAboutPage[key] = aboutPageAttributes[key] as any;
            });
            const updatedAboutPage = await existingAboutPage.save();
            return updatedAboutPage;
        }
    }
    public static async getAboutPageByUserId(userId: IdType) {
        const aboutPage = await AboutPageModel.findOne({ userId });
        return aboutPage;
    }
    public static async addOrUpdateAboutSection(userId: IdType, aboutSectionAttributes: NexusGenInputs['AboutSectionInput']) {
        if (aboutSectionAttributes.id || aboutSectionAttributes.name) {
            const existingSection = !!aboutSectionAttributes.id 
                ? await AboutSectionModel.findOne({ userId, _id: aboutSectionAttributes.id })
                : !!aboutSectionAttributes.name
                ? await AboutSectionModel.findOne({ userId, name: { $regex: new RegExp(aboutSectionAttributes.name, 'i') } })
                : null;
            if (existingSection){
                const keys = Object.keys(aboutSectionAttributes) as (keyof typeof aboutSectionAttributes)[];
                keys.forEach((key) =>{
                    if (key !== 'id')
                        existingSection[key] = aboutSectionAttributes[key] as any;
                });
                const updatedSection = await existingSection.save();
                return updatedSection;
            } else if (aboutSectionAttributes.id) throw new Error('Section not found');
        }
        const newSection = await AboutSectionModel.create({ userId, ...aboutSectionAttributes });
        return newSection;
    }
    public static async getAboutSectionsByUserId(userId: IdType) {
        const sections = await AboutSectionModel.find({ userId });
        return sections;
    }
    public static async getAboutArticlesBySectionId(sectionId: IdType) {
        const articles = await AboutArticleModel.find({ sectionId });
        return articles;
    }
    public static async addOrUpdateAboutArticle(userId: IdType, sectionId: IdType, articleAttributes: NexusGenInputs['AboutArticleInput']) {
        const section = await AboutSectionModel.findById(sectionId);
        if (!section || section.userId!.toString() !== userId.toString())
            throw new Error('Atricle not found');
        if (articleAttributes.id) {
            const existing = await AboutArticleModel.findOne({ sectionId, _id: articleAttributes.id });
            if (existing){
                const keys = Object.keys(articleAttributes) as (keyof typeof articleAttributes)[];
                keys.forEach((key) =>{
                    if (key !== 'id')
                    existing[key] = articleAttributes[key] as any;
                });
                const updated = await existing.save();
                return updated;
            } 
            throw new Error('Invalid article Id');
        }
        const newSection = await AboutArticleModel.create({ sectionId: section.id, ...articleAttributes });
        return newSection;
    }
}