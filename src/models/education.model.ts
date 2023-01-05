import mongoose, { Schema } from "mongoose";
const { Types: { String, Boolean, ObjectId, Number } } = Schema;

const EducationSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', require: true },
    course: { type: String, require: true },
    gpa: { type: String, require: true },
    institute: { type: String, require: true },
    campus: { type: String, require: true },
    duration: { type: String, require: true },
    startDate: { type: String, require: true },
    endDate: { type: String, require: true },
    level: { type: String, require: true },
});
export const EducationModel = mongoose.model('Education', EducationSchema);