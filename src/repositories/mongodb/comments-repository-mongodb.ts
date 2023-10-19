import {ObjectId} from "mongodb";
import {
    commentModelWithMongoId,
    commentViewModel,
    commentViewModelWithId
} from "../../models/comments-view-model";
import {CommentModel} from "../../schemas/comment-schema";

export const commentsRepository = {

    async createComment(newComment: commentModelWithMongoId): Promise<commentViewModelWithId> {

        const result = await CommentModel.insertMany([newComment]);
        return {
            id: newComment._id.toString(),
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt,
        }
    },

    async updateComment(_id: ObjectId, content: string) {
        const updatedComment = await CommentModel.updateOne({_id}, {
            $set:
                {
                    content: content
                }
        })

        const comment: commentViewModel | null = await CommentModel.findOne({_id}, {projection: {_id: 0}});
        if (comment) {
            return true
        } else
            return false
    },

    async deleteComment(_id: ObjectId) {
        const deletedComment = await CommentModel.deleteOne({_id});
        const comment = await CommentModel.findOne({_id}, {projection: {_id: 0}});
        if (!comment) {
            return true
        }
        return false
    },

    async deleteAll() {
        return CommentModel.deleteMany({}, {});
    }
}
