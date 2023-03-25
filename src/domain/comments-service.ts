import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {commentModelWithMongoId} from "../models/comments-view-model";
import {commentsRepository} from "../repositories/mongodb/comments-repository-mongodb";

export const commentsService = {
    async createComment(content: string, userId: string) {

        let foundUserById = await usersQueryRepository.findUserById(new ObjectId(userId))

        if (foundUserById) {
            const newComment : commentModelWithMongoId = {
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

    async deletePost(_id: ObjectId) {
        return await commentsRepository.deleteComment(_id);
    },

    async deleteAll() {
        return await commentsRepository.deleteAll();
    }
}