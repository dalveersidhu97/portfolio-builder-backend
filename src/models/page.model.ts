import mongoose, { Schema } from "mongoose";
const { Types: { String, Boolean, ObjectId, Number } } = Schema;

const PageSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', require: true },
    summary: { type: String, default: '' },
    title: { type: String, default: '' },
    name: { type: String, default: null, require: true }
});
export const PageModel = mongoose.model('Page', PageSchema);