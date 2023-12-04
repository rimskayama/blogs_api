import {PostLikeModel} from "../../schemas/like-schema";
import {injectable} from "inversify";
import {PostLike} from "../../models/like-view-model";

@injectable()
export class PostLikesRepository {
    async countLikes(postId: string) {
        const likesCount = await PostLikeModel.countDocuments(
            {
                status: "Like",
                postId: postId,
            }
        )
        const dislikesCount = await PostLikeModel.countDocuments(
            {
                status: "Dislike",
                postId: postId,
            }
        )

        return {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            }
    }

    async setLikeStatus(newStatus: PostLike) {

        const postId = newStatus.postId
        const userId = newStatus.userId
        await PostLikeModel.insertMany([newStatus])
        const like = await PostLikeModel.findOne (
            {$and: [{postId: postId}, {userId: userId}]})
        if (like) {
            return true
        } return false
    }

    async checkLikeInDB(postId: string, userId: string) {
        const like = await PostLikeModel.findOne(
            {$and: [{postId: postId}, {userId: userId}]})
        if (like) {
            return like
        } return false
    }

    async updateLikeStatus(likeStatus: string, postId: string, userId: string) {
        return PostLikeModel.findOneAndUpdate(
            {$and: [{postId: postId}, {userId: userId}]}, {
                $set:
                    {
                        status: likeStatus,
                        addedAt: new Date().toISOString()
                    }
            });
    }

    async removeLike(postId: string, userId: string) {
        await PostLikeModel.deleteOne({$and: [{postId: postId}, {userId: userId}]});
        const like = await PostLikeModel.findOne({$and: [{postId: postId}, {userId: userId}]});
        if (!like) {
            return true
        }
        return false
    }
}