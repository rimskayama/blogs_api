import mongoose from 'mongoose'
import {ObjectId} from "mongodb";
import {Like} from "../models/like-view-model";
export const LikeSchema = new mongoose.Schema<Like>({
    _id: { type: ObjectId, require: true },
    commentId: {type: String, require: true},
    status: { type: String, require: true },
    userId: { type: String, require: true },
    userLogin: { type: String, require: true },
    lastModified: { type: String, require: true },
})
export const LikeModel = mongoose.model<Like>('Likes', LikeSchema)