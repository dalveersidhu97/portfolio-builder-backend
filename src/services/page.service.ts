import { PageModel } from "../models";
import { NexusGenInputs } from "../schema/nexus-typegen";
import { IdType } from "../types";

const getKeys = <T extends {}>(obj: T) => {
    const keys = Object.keys(obj) as (keyof T)[];
    return keys;
}

export class PageService {
    public static async createOrUpdatePage (userId: IdType, pageName: string, updateAttributes: NexusGenInputs['PageInput']) {
        const existingPage = await PageModel.findOne({ userId, name: pageName });
        if (existingPage) {
            const keys = getKeys(updateAttributes);
            keys.forEach(key => {
                existingPage[key] = updateAttributes[key] as any;
            });
            const updatedPage = await existingPage.save();
            return updatedPage;
        }else {
            const newPage = await PageModel.create({ ...updateAttributes, userId });
            return newPage;
        }
    }
    public static async getPage (userId: IdType, pageName: string) {
        const page = await PageModel.findOne({ userId, name: pageName });
        return page;
    }
}