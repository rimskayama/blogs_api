import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {commentModelWithPostId} from "../models/comments-view-model";
import {commentsRepository} from "../repositories/mongodb/comments-repository-mongodb";
import {postsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";

export const commentsService = {

    async findCommentById(id: string, userId: string | false) {
        return await commentsRepository.findCommentById(new ObjectId(id), userId)
    },

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
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }
            }
            return await commentsRepository.createComment(newComment);
        } else return null

    },

    async updateComment(id: string, content: string) {
        return await commentsRepository.updateComment(new ObjectId(id), content);

    },

    async deleteComment(id: string) {
        return await commentsRepository.deleteComment(new ObjectId(id));
    },

    async deleteAll() {
        return await commentsRepository.deleteAll();
    }
}