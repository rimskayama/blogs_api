import {commentViewModelWithId} from "../models/comments-view-model";
import {likesRepository} from "../repositories/mongodb/likes-repository";
import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";

export const likesService = {

    async setLikeStatus(likeStatus: string, comment: commentViewModelWithId, userId: string) {
        const user = await usersQueryRepository.findUserById(new ObjectId(userId))
        const like = {
            _id: new ObjectId(),
            commentId: new ObjectId(comment.id),
            status: likeStatus,
            userId: new ObjectId(userId),
            userLogin: user!.login,
            lastModified: new Date().toISOString()
        }
            return await likesRepository.setLikeStatus(like)
    },

    async checkLikeStatus(likeStatus: string, commentId: string, userId: string) {
        if (likeStatus === "None") {
            await likesRepository.removeLike(commentId, userId)
            return true
        } else {
            //Like or Dislike
            const likeInDB = await likesRepository.checkLikeInDB(new ObjectId(commentId), userId)
            if (!likeInDB) return false // can be created
            if (likeInDB) {
                if (likeInDB.status === likeStatus) return true
                if (likeInDB.status !== likeStatus) {
                    await likesRepository.updateLikeStatus(likeStatus, commentId, userId)
                    return true
                }
            }
        }
    },

    async getUserLikeStatus (commentId: ObjectId, userId: string | false) {
        let likeStatus = "None"
        if (userId) {
            const likeInDB = await likesRepository.checkLikeInDB(commentId, userId)
            if (likeInDB) {
                likeStatus = likeInDB.status.toString()
                return likeStatus
            } else return likeStatus
        } return likeStatus
    },

    async countLikes(commentId: string) {
        await likesRepository.countLikes(commentId)
    },

    // async getCommentLikes(commentId: string) {
    //     return await likesRepository.getCommentLikes(commentId)
    // }
}
