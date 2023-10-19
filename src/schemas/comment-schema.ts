import mongoose from 'mongoose'
import {commentModelWithPostId} from "../models/comments-view-model";
import {ObjectId} from "mongodb";

export const CommentSchema = new mongoose.Schema<commentModelWithPostId>({

    _id: { type: ObjectId, require: true },
    postId: {type: String, require: true},
    content: {type: String, require: true},
    commentatorInfo: {
        type: {
        userId: {type: String, require: true},
        userLogin: {type: String, require: true}}
    },
    createdAt: {type: String, require: true}

})
export const CommentModel = mongoose.model<commentModelWithPostId>('comments', CommentSchema)