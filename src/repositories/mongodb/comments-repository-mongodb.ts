import {ObjectId} from "mongodb";
import {
    Comment,
    commentViewModel
} from "../../models/comments-view-model";
import {CommentModel} from "../../schemas/comment-schema";
import {LikeModel} from "../../schemas/like-schema";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async findCommentById(_id: ObjectId, userId: string | false): Promise<commentViewModel | null> {
        const comment: Comment | null = await CommentModel.findOne({_id});
        if (!comment) {
            return null;
        }

        comment.likesInfo.myStatus = "None"
        if (userId) {
            const likeInDB = await LikeModel.findOne(
                {$and: [{commentId: comment._id}, {userId: userId}]})
            if (likeInDB) {
                comment.likesInfo.myStatus = likeInDB.status.toString()
            }
        }
        return Comment.getViewComment(comment)
    }
    async createComment(newComment: Comment): Promise<commentViewModel> {

        await CommentModel.insertMany([newComment]);
        return Comment.getViewComment(newComment)
    }

    async updateComment(_id: ObjectId, content: string) {
        await CommentModel.updateOne({_id}, {
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
    }

    async updateCommentLikes(commentId: string, likesCount: number, dislikesCount: number) {

        await CommentModel.updateOne({_id: new ObjectId(commentId)}, {
            $set:
                {
                    "likesInfo.likesCount": likesCount,
                    "likesInfo.dislikesCount": dislikesCount,
                }

        });
    }

    async deleteComment(_id: ObjectId) {
        await CommentModel.deleteOne({_id});
        const comment = await CommentModel.findOne({_id}, {projection: {_id: 0}});
        if (!comment) {
            return true
        }
        return false
    }

    async deleteAll() {
        return CommentModel.deleteMany({}, {});
    }
}
