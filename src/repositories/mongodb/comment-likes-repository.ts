import {CommentLikeModel} from "../../schemas/like-schema";
import {injectable} from "inversify";
import {CommentLike} from "../../models/like-view-model";

@injectable()
export class CommentLikesRepository {
    async countLikes(commentId: string) {
        const likesCount = await CommentLikeModel.countDocuments(
            {
                status: "Like",
                commentId: commentId,
            }
        )
        const dislikesCount = await CommentLikeModel.countDocuments(
            {
                status: "Dislike",
                commentId: commentId,
            }
        )
        return {
            likesCount: likesCount,
            dislikesCount: dislikesCount}
    }

    async setLikeStatus(newStatus: CommentLike) {

        const commentId = newStatus.commentId
        const userId = newStatus.userId
        await CommentLikeModel.insertMany([newStatus])
        const like = await CommentLikeModel.findOne (
            {$and: [{commentId: commentId}, {userId: userId}]})
        if (like) {
            return true
        } return false
    }

    async checkLikeInDB(commentId: string, userId: string) {
        const like = await CommentLikeModel.findOne(
            {$and: [{commentId: commentId}, {userId: userId}]})
        if (like) {
            return like
        } return false
    }

    async updateLikeStatus(likeStatus: string, commentId: string, userId: string) {
        return CommentLikeModel.findOneAndUpdate(
            {$and: [{commentId: commentId}, {userId: userId}]}, {
            $set:
                {
                    status: likeStatus,
                    addedAt: new Date().toISOString()
                }
        });
    }

    async removeLike(commentId: string, userId: string) {
        await CommentLikeModel.deleteOne({$and: [{commentId: commentId}, {userId: userId}]});
        const like = await CommentLikeModel.findOne({$and: [{commentId: commentId}, {userId: userId}]});
        if (!like) {
            return true
        }
        return false
    }

    // async getCommentLikes(commentId: string) {
    //     const commentLikes = await LikeModel.find({commentId: commentId}).lean()
    //     return {commentLikes}
    // }
}