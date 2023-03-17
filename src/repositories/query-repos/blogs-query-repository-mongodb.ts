import {blogModelWithMongoId, blogViewModelWithId} from "../../models/blogViewModel";
import {blogsCollection} from "../db";
import {blogsMapping} from "../../functions/mapping";
import {ObjectId} from "mongodb";

export const blogsQueryRepository = {
    async findBlogs(): Promise<blogViewModelWithId[]> {
        let allBlogs = blogsCollection.find({}, {}).toArray();
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