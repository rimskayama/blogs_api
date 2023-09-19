import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {commentModelWithPostId} from "../models/comments-view-model";
import {commentsRepository} from "../repositories/mongodb/comments-repository-mongodb";
import {postsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";

export const commentsService = {

    async createComment(content: string, userId: string, postId: string) {

        let foundPostById = await postsQueryRepository.findPostById(new ObjectId(postId));

        let foundUserById = await usersQueryRepository.findUserById(new ObjectId(userId))

        if (foundUserById && foundPostById) {
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
        return await commentsRepository.updateComment(_id, content);

    },

    async deleteComment(_id: ObjectId) {
        return await commentsRepository.deleteComment(_id);
    },

    async deleteAll() {
        return await commentsRepository.deleteAll();
    }
}