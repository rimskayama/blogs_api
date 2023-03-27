import {ObjectId} from "mongodb";
import {commentsCollection} from "../db";
import {commentModelWithMongoId, commentViewModel, commentViewModelWithId} from "../../models/comments-view-model";

export const commentsRepository = {

    async createComment(newComment: commentModelWithMongoId): Promise<commentViewModelWithId> {

        const result = await commentsCollection.insertOne(newComment);
        return {
            id: newComment._id.toString(),
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt,
        }
    },

    async updateComment(_id: ObjectId, content: string) {
        const updatedComment = await commentsCollection.updateOne({_id}, {
            $set:
                {
                    content: content
                }
        })

        const comment: commentViewModel | null = await commentsCollection.findOne({_id}, {projection: {_id: 0}});
        if (comment) {
            return true
        } else
            return false
    },

    async deleteComment(_id: ObjectId) {
        const deletedComment = await commentsCollection.deleteOne({_id});
        const comment = await commentsCollection.findOne({_id}, {projection: {_id: 0}});
        if (!comment) {
            return true
        }
        return false
    },

    async deleteAll() {
        return await commentsCollection.deleteMany({}, {});
    }
}
