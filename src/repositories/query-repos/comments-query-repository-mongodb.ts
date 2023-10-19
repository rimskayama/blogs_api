import {ObjectId, SortDirection} from "mongodb";
import {commentsMapping} from "../../functions/mapping";
import {commentModelWithMongoId, commentViewModelWithId} from "../../models/comments-view-model";
import {CommentModel} from "../../schemas/comment-schema";

export const commentsQueryRepository = {

    async findCommentById(_id: ObjectId): Promise<commentViewModelWithId | null> {
        const comment: commentModelWithMongoId | null = await CommentModel.findOne({_id});
        if (!comment) {
            return null;
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
        };
    },

    async findCommentsByPostId(postId: string, page: number, limit: number, sortDirection: SortDirection,
                            sortBy: string, skip: number) {
        const commentsByPostId = await CommentModel.find(
            {postId: postId},
        )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .lean()

        const total = await CommentModel.countDocuments({postId: postId})

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: commentsMapping(commentsByPostId)
        }}
}