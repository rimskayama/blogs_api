import {Post, postViewModel} from "../../models/post-view-model";
import {postsMapping} from "../../functions/mapping";
import {ObjectId, SortDirection} from "mongodb";
import {postsPaginationViewModel} from "../../models/pagination-view-models";
import {PostModel} from "../../schemas/post-schema";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepository {
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
    }

    async findPostById(_id: ObjectId): Promise<postViewModel | null> {
        const post: Post | null = await PostModel.findOne({_id});
        if (!post) {
            return null;
        }
        return Post.getViewPost(post)
    }

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