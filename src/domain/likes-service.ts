import {commentViewModel} from "../models/comments-view-model";
import {CommentLikesRepository} from "../repositories/mongodb/comment-likes-repository";
import {ObjectId} from "mongodb";
import {UsersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {CommentLike, PostLike} from "../models/like-view-model";
import {inject, injectable} from "inversify";
import {PostLikesRepository} from "../repositories/mongodb/post-likes-repository";
import {postViewModel} from "../models/post-view-model";

@injectable()
export class LikesService {
    constructor(
        @inject(CommentLikesRepository) protected commentLikesRepository: CommentLikesRepository,
        @inject(PostLikesRepository) protected postLikesRepository: PostLikesRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {
    }

    //COMMENT LIKES

    async setCommentLikeStatus(likeStatus: string, comment: commentViewModel, userId: string) {
        const user = await this.usersQueryRepository.findUserById(new ObjectId(userId))
        const like = new CommentLike(comment.id, likeStatus, userId, user!.login)
        return await this.commentLikesRepository.setLikeStatus(like)
    }

    async checkCommentLikeStatus(likeStatus: string, commentId: string, userId: string) {
        if (likeStatus === "None") {
            await this.commentLikesRepository.removeLike(commentId, userId)
            return true
        } else {
            //Like or Dislike
            const likeInDB = await this.commentLikesRepository.checkLikeInDB(commentId, userId)
            if (!likeInDB) return false // can be created
            if (likeInDB) {
                if (likeInDB.status === likeStatus) return true
                if (likeInDB.status !== likeStatus) {
                    await this.commentLikesRepository.updateLikeStatus(likeStatus, commentId, userId)
                    return true
                }
            }
        }
    }

    async countCommentLikes(commentId: string) {
        return await this.commentLikesRepository.countLikes(commentId)
    }

    // POST LIKES

    async setPostLikeStatus(likeStatus: string, post: postViewModel, userId: string) {
        const user = await this.usersQueryRepository.findUserById(new ObjectId(userId))
        const description = "Details about single like"
        const like = new PostLike(post.id, likeStatus, userId, user!.login, description)
        return await this.postLikesRepository.setLikeStatus(like)
    }

    async checkPostLikeStatus(likeStatus: string, postId: string, userId: string) {
        if (likeStatus === "None") {
            await this.postLikesRepository.removeLike(postId, userId)
            return true
        } else {
            //Like or Dislike
            const likeInDB = await this.postLikesRepository.checkLikeInDB(postId, userId)
            if (!likeInDB) return false // can be created
            if (likeInDB) {
                if (likeInDB.status === likeStatus) return true
                if (likeInDB.status !== likeStatus) {
                    await this.postLikesRepository.updateLikeStatus(likeStatus, postId, userId)
                    return true
                }
            }
        }
    }
    async countPostLikes(postId: string) {
        return await this.postLikesRepository.countLikes(postId)
    }

}
