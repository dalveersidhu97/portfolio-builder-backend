import mongoose, { Schema } from "mongoose";
const { Types: { String, Boolean, ObjectId, Number } } = Schema;

const RefreshTokenSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        require: true
    },
    refreshToken: { type: String, require: true, unique: true }
});
export const RefreshTokenModel = mongoose.model('RefreshTokens', RefreshTokenSchema);