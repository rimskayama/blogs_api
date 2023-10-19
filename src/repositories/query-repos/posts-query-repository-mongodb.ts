import {postModelWithMongoId, postViewModelWithId} from "../../models/post-view-model";
import {postsMapping} from "../../functions/mapping";
import {ObjectId, SortDirection} from "mongodb";
import {postsPaginationViewModel} from "../../models/pagination-view-models";
import {PostModel} from "../../schemas/post-schema";

export const postsQueryRepository = {

    async findPosts(
    page: number, limit: number, sortDirection: SortDirection,
    sortBy: string, skip: number): Promise<postsPaginationViewModel> {
        let allPosts = await PostModel.find(
            {},{})
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .lean()

        const total = await PostModel.countDocuments()

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: postsMapping(allPosts)
        }
    },

    async findPostById(_id: ObjectId): Promise<postViewModelWithId | null> {
        const post: postModelWithMongoId | null = await PostModel.findOne({_id});
        if (!post) {
            return null;
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
    },

    async findPostsByBlogId(blogId: string, page: number, limit: number, sortDirection: SortDirection,
                            sortBy: string, skip: number) {
        const postsByBlogId = await PostModel.find(
            {blogId: blogId},
            )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .lean()

        const total = await PostModel.countDocuments({blogId: blogId})

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: postsMapping(postsByBlogId)
}}
}