import {postModelWithMongoId, postViewModelWithId} from "../../models/postViewModel";
import {postsCollection} from "../db";
import {postsMapping} from "../../functions/mapping";
import {ObjectId, SortDirection} from "mongodb";

export const postsQueryRepository = {

    async findPosts(
    page: number, limit: number, sortDirection: SortDirection,
    sortBy: string, skip: number) {
        let allPosts = await postsCollection.find(
            {},
        )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .toArray()

        const total = await postsCollection.countDocuments({})

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
        const post: postModelWithMongoId | null = await postsCollection.findOne({_id});
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
        const postsByBlogId = await postsCollection.find(
            {blogId: blogId},
            )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .toArray()

        const total = await postsCollection.countDocuments({blogId: blogId})

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: postsMapping(postsByBlogId)
        }
}}