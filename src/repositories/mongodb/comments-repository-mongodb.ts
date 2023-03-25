import {ObjectId} from "mongodb";
import {commentModelWithMongoId, commentViewModelWithId} from "../../models/comments-view-model";
import {commentsCollection} from "../db";

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

    // todo update comment
    async deleteComment(_id: ObjectId) {
        const post = await commentsCollection.findOne({_id}, {projection: {_id: 0}});
        if (post) {
            return await commentsCollection.deleteOne(post);
        }
        return null
    },

    async deleteAll() {
        return await commentsCollection.deleteMany({}, {});
    }
}
