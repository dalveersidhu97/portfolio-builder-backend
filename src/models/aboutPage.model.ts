import mongoose, { Schema } from "mongoose";
const { Types: { String, Boolean, ObjectId, Number } } = Schema;

const AboutPageSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', require: true },
    summary: { type: String, default: '' },
    title: { type: String, default: '' },
});
export const AboutPageModel = mongoose.model('AboutPage', AboutPageSchema);

const AboutSectionSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', require: true },
    name: { type: String, default: '' },
});
export const AboutSectionModel = mongoose.model('AboutSection', AboutSectionSchema);

const AboutArticleSchema = new Schema({
    sectionId: { type: ObjectId, ref: 'AboutSection', require: true },
    label: { type: String, default: '' },
    content: { type: String, default: '' },
    icon: { type: String, default: '' },
});
export const AboutArticleModel = mongoose.model('AboutArticle', AboutArticleSchema);