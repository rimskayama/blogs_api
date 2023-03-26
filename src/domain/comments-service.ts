import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {commentModelWithMongoId, commentModelWithPostId, withMongoId} from "../models/comments-view-model";
import {commentsRepository} from "../repositories/mongodb/comments-repository-mongodb";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";

export const commentsService = {
    async createComment(content: string, userId: string, postId: string) {

        let foundUserById = await usersQueryRepository.findUserById(new ObjectId(userId))

        if (foundUserById) {
            const newComment : commentModelWithPostId = {
                postId: postId,
                _id: new ObjectId(),
                content: content,
                commentatorInfo: {
                userId: foundUserById.id,
                userLogin: foundUserById.login
                },
                createdAt: (new Date()).toISOString(),
            }
            return await commentsRepository.createComment(newComment);
        } else return null

    },

    async updateComment(_id: ObjectId, content: string) {

        let foundCommentById = await commentsQueryRepository.findCommentById(_id)

        if (foundCommentById) {
            return await commentsRepository.updateComment(_id, content);
        }

    },

    async deleteComment(_id: ObjectId) {
        return await commentsRepository.deleteComment(_id);
    },

    async deleteAll() {
        return await commentsRepository.deleteAll();
    }
}