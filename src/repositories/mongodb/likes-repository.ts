import {likeInfoModel} from "../../models/like-view-model";
import {LikeModel} from "../../schemas/like-schema";
import {commentsRepository} from "./comments-repository-mongodb";

export const likesRepository = {

    async countLikes(commentId: string) {
        const likesCount = await LikeModel.countDocuments(
            {
                status: "Like",
                commentId: commentId,
            }
        )
        const dislikesCount = await LikeModel.countDocuments(
            {
                status: "Dislike",
                commentId: commentId,
            }
        )
        return await commentsRepository.updateCommentLikes(commentId, likesCount, dislikesCount)
    },

    async setLikeStatus(newStatus: likeInfoModel) {

        const commentId = newStatus.commentId
        const userId = newStatus.userId
        await LikeModel.insertMany([newStatus])
        const like = await LikeModel.findOne (
            {$and: [{commentId: commentId}, {userId: userId}]})
        if (like) {
            return true
        } return false
    },

    async checkLikeInDB(commentId: string, userId: string) {
        const like = await LikeModel.findOne(
            {$and: [{commentId: commentId}, {userId: userId}]})
        if (like) {
            return like
        } return false
    },

    async updateLikeStatus(likeStatus: string, commentId: string, userId: string) {
        return LikeModel.findOneAndUpdate({$and: [{commentId: commentId}, {userId: userId}]}, {
            $set:
                {
                    status: likeStatus,
                    lastModified: new Date().toISOString()
                }
        });
    },

    async removeLike(commentId: string, userId: string) {
        await LikeModel.deleteOne({$and: [{commentId: commentId}, {userId: userId}]});
        const like = await LikeModel.findOne({$and: [{commentId: commentId}, {userId: userId}]});
        if (!like) {
            return true
        }
        return false
    },

    // async getCommentLikes(commentId: string) {
    //     const commentLikes = await LikeModel.find({commentId: commentId}).lean()
    //     return {commentLikes}
    // }
}