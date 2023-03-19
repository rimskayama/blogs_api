import {blogModelWithMongoId, blogViewModelWithId} from "../../models/blogViewModel";
import {blogsCollection} from "../db";
import {blogsMapping} from "../../functions/mapping";
import {ObjectId, SortDirection} from "mongodb";

import {getPagination} from "../../functions/pagination";

export const blogsQueryRepository = {
    async findBlogs(
        page: number, limit: number, sortDirection: SortDirection,
        sortBy: string, searchNameTerm: string, skip: number): Promise<blogViewModelWithId[]>
    {
        let allBlogs = blogsCollection.find({name : searchNameTerm}, {}).toArray();
        return blogsMapping(await allBlogs)
    },

    async findBlogById(_id: ObjectId): Promise<blogViewModelWithId | null> {
        const blog: blogModelWithMongoId | null = await blogsCollection.findOne({_id});
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}