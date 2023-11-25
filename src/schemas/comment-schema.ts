import mongoose from 'mongoose'
import {Comment} from "../models/comments-view-model";
import {ObjectId} from "mongodb";

export const CommentSchema = new mongoose.Schema<Comment>({

    _id: { type: ObjectId, require: true },
    postId: {type: String, require: true},
    content: {type: String, require: true},
    commentatorInfo: {
        type: {
        userId: {type: String, require: true},
        userLogin: {type: String, require: true}}
    },
    createdAt: {type: String, require: true},
    likesInfo: {
        type: {
        likesCount: {type: Number, default: 0},
        dislikesCount: {type: Number, default: 0},
        myStatus: {type: String, default: "None"}
    }
    }

})
export const CommentModel = mongoose.model<Comment>('comments', CommentSchema)