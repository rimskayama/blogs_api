import mongoose from 'mongoose'
import {Post} from "../models/post-view-model";

export const PostSchema = new mongoose.Schema<Post>({
    _id: { type: mongoose.Schema.Types.ObjectId, require: true },
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, default: Date.now.toString() },
    extendedLikesInfo: {
        type: {
            likesCount: {type: Number, default: 0},
            dislikesCount: {type: Number, default: 0},
        }
    }
})
export const PostModel = mongoose.model<Post>('posts', PostSchema)