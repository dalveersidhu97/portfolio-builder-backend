import { Document } from "mongoose";
import { NexusGenInputs } from "../schema/nexus-typegen";

export const updateModel  = async <T extends NexusGenInputs[keyof NexusGenInputs], M extends T & Document<any, any, T>>(model: M | null, updateAttributes: T) => {
    if (!model) return null;
    const updateKeys = Object.keys(updateAttributes) as (keyof typeof updateAttributes)[];
    updateKeys.forEach(key => {
        if (typeof key==='string' && !['confirmPassword'].includes(key))
            model[key] = updateAttributes[key] as any;
    });
    const updatedModel = await model.save();
    return updatedModel as M;
}