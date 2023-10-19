import mongoose from 'mongoose'
import {postViewModel} from "../models/post-view-model";

export const PostSchema = new mongoose.Schema<postViewModel>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, default: Date.now.toString() },
})
export const PostModel = mongoose.model<postViewModel>('posts', PostSchema)