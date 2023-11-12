import {ObjectId} from "mongodb";
import {
    commentModelWithMongoId,
    commentViewModel,
    commentViewModelWithId
} from "../../models/comments-view-model";
import {CommentModel} from "../../schemas/comment-schema";
import {likesService} from "../../domain/likes-service";

export const commentsRepository = {

    async findCommentById(_id: ObjectId, userId: string | false): Promise<commentViewModelWithId | null> {
        const comment: commentModelWithMongoId | null = await CommentModel.findOne({_id});
        if (!comment) {
            return null;
        }
        const userLikeStatus = await likesService.getUserLikeStatus(comment._id, userId)
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: userLikeStatus
            }
        };
    },

    async createComment(newComment: commentModelWithMongoId): Promise<commentViewModelWithId> {

        const result = await CommentModel.insertMany([newComment]);
        return {
            id: newComment._id.toString(),
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt,
            likesInfo: {
                likesCount: newComment.likesInfo.likesCount,
                dislikesCount: newComment.likesInfo.dislikesCount,
                myStatus: newComment.likesInfo.myStatus
            }
        }
    },

    async updateComment(_id: ObjectId, content: string) {
        const updatedComment = await CommentModel.updateOne({_id}, {
            $set:
                {
                    content: content
                }
        })

        const comment: commentViewModel | null = await CommentModel.findOne(
            {_id}, {projection: {_id: 0}});
        if (comment) {
            return true
        } else
            return false
    },

    async updateCommentLikes(commentId: string, likesCount: number, dislikesCount: number) {

        CommentModel.updateOne({_id: commentId}, {
            $set:
                {
                    "likesInfo.likesCount": likesCount,
                    "likesInfo.dislikesCount": dislikesCount,
                }

        });
    },

    async deleteComment(_id: ObjectId) {
        const deletedComment = await CommentModel.deleteOne({_id});
        const comment = await CommentModel.findOne({_id}, {projection: {_id: 0}});
        if (!comment) {
            return true
        }
        return false
    },

    async deleteAll() {
        return CommentModel.deleteMany({}, {});
    }
}
