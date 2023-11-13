import {SortDirection} from "mongodb";
import {commentsMapping} from "../../functions/mapping";
import {CommentModel} from "../../schemas/comment-schema";
import {likesService} from "../../domain/likes-service";

export const commentsQueryRepository = {

    async findCommentsByPostId(postId: string, page: number, limit: number, sortDirection: SortDirection,
                               sortBy: string, skip: number, userId: string | false) {
        const commentsByPostId = await CommentModel.find(
            {postId: postId},
        )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .lean()

        let idList = []
        for (let i = 0; i < commentsByPostId.length; i++) {
            idList.push(commentsByPostId[i]._id)
            console.log(idList)
        }

        let statusList: string[] = []
        for (let i = 0; i < commentsByPostId.length; i++) {
            let likeStatus = await likesService.getUserLikeStatus(commentsByPostId[i]._id.toString(), userId)
            statusList.push(likeStatus)
            console.log(statusList)
        }

        for (let i = 0; i < commentsByPostId.length; i++) {
            commentsByPostId.map((obj, number) => obj.likesInfo.myStatus = statusList[number])
        }

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