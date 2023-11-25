import {commentViewModel} from "../models/comments-view-model";
import {LikesRepository} from "../repositories/mongodb/likes-repository";
import {ObjectId} from "mongodb";
import {UsersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {Like} from "../models/like-view-model";

export class LikesService {
    likesRepository: LikesRepository
    usersQueryRepository: UsersQueryRepository
    constructor() {
        this.likesRepository = new LikesRepository()
        this.usersQueryRepository = new UsersQueryRepository()
    }

    async setLikeStatus(likeStatus: string, comment: commentViewModel, userId: string) {
        const user = await this.usersQueryRepository.findUserById(new ObjectId(userId))
        const like = new Like(comment.id, likeStatus, userId, user!.login)
        return await this.likesRepository.setLikeStatus(like)
    }

    async checkLikeStatus(likeStatus: string, commentId: string, userId: string) {
        if (likeStatus === "None") {
            await this.likesRepository.removeLike(commentId, userId)
            return true
        } else {
            //Like or Dislike
            const likeInDB = await this.likesRepository.checkLikeInDB(commentId, userId)
            if (!likeInDB) return false // can be created
            if (likeInDB) {
                if (likeInDB.status === likeStatus) return true
                if (likeInDB.status !== likeStatus) {
                    await this.likesRepository.updateLikeStatus(likeStatus, commentId, userId)
                    return true
                }
            }
        }
    }

    async getUserLikeStatus (commentId: string, userId: string | false) {
        let likeStatus = "None"
        if (userId) {
            const likeInDB = await this.likesRepository.checkLikeInDB(commentId, userId)
            if (likeInDB) {
                likeStatus = likeInDB.status.toString()
                return likeStatus
            } else return likeStatus
        } return likeStatus
    }

    async countLikes(commentId: string) {
        return await this.likesRepository.countLikes(commentId)
    }

    // async getCommentLikes(commentId: string) {
    //     return await likesRepository.getCommentLikes(commentId)
    // }
}
