import mongoose from 'mongoose'
import {CommentLike, PostLike} from "../models/like-view-model";
export const CommentLikeSchema = new mongoose.Schema<CommentLike>({
    _id: { type: mongoose.Schema.Types.ObjectId, require: true },
    commentId: {type: String, require: true},
    status: { type: String, require: true },
    userId: { type: String, require: true },
    userLogin: { type: String, require: true },
    addedAt: { type: String, require: true },
})
export const CommentLikeModel = mongoose.model<CommentLike>('Comment likes', CommentLikeSchema)

export const PostLikeSchema = new mongoose.Schema<PostLike>({
    _id: { type: mongoose.Schema.Types.ObjectId, require: true },
    postId: {type: String, require: true},
    status: { type: String, require: true },
    userId: { type: String, require: true },
    userLogin: { type: String, require: true },
    addedAt: { type: String, require: true },


})
export const PostLikeModel = mongoose.model<PostLike>('Post likes', PostLikeSchema)
