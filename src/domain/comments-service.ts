import {ObjectId} from "mongodb";
import {UsersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {Comment} from "../models/comments-view-model";
import {CommentsRepository} from "../repositories/mongodb/comments-repository-mongodb";
import {PostsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";
import {CommentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {
}

    async findCommentById(id: string, userId: string | false) {
        return await this.commentsRepository.findCommentById(new ObjectId(id), userId)
    }

    async createComment(content: string, userId: string, postId: string) {

        let foundPostById = await this.postsQueryRepository.findPostById(postId, false);

        let foundUserById = await this.usersQueryRepository.findUserById(new ObjectId(userId))

        if (foundUserById && foundPostById) {
            const newComment = new Comment(postId, content,
                {userId: foundUserById.id, userLogin: foundUserById.login},
                {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                })
            return await this.commentsRepository.createComment(newComment);
        } else return null

    }

    async updateComment(id: string, content: string) {
        return await this.commentsRepository.updateComment(new ObjectId(id), content);

    }

    async deleteComment(id: string) {
        return await this.commentsRepository.deleteComment(new ObjectId(id));
    }

    async deleteAll() {
        return await this.commentsRepository.deleteAll();
    }
}