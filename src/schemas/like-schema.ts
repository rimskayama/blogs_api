import mongoose from 'mongoose'
import {likeInfoModel} from "../models/like-view-model";
import {ObjectId} from "mongodb";
export const LikeSchema = new mongoose.Schema<likeInfoModel>({
    _id: { type: ObjectId, require: true },
    commentId: {type: String, require: true},
    status: { type: String, require: true },
    userId: { type: String, require: true },
    userLogin: { type: String, require: true },
    lastModified: { type: String, require: true },
})
export const LikeModel = mongoose.model<likeInfoModel>('Likes', LikeSchema)