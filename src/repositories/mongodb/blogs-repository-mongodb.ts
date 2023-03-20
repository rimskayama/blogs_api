
import {blogsCollection} from "../db";
import {blogModelWithMongoId, blogViewModelWithId, blogViewModel} from "../../models/blogViewModel";
import {ObjectId} from "mongodb";

export const blogsRepository  = {

    async findBlogName(blogId: string): Promise<blogModelWithMongoId | null> {

        let foundBlogByName = await blogsCollection.findOne({_id: new ObjectId(blogId)}, {})

        return foundBlogByName || null
    },

    async createBlog(
        newBlog : blogModelWithMongoId): Promise<blogViewModelWithId> {

        const result = await blogsCollection.insertOne(newBlog)
        return {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },
    async updateBlog(_id: ObjectId, name: string, description: string, websiteUrl: string, isMembership: boolean | false): Promise<blogViewModelWithId | boolean> {

        const updatedBlog = await blogsCollection.updateOne({_id}, {
            $set:
                {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                    isMembership: isMembership || false,
                }
        })

        const blog: blogViewModel | null = await blogsCollection.findOne({_id}, {projection: {_id: 0}});
        if (blog) {
            return true
        } else
            return false
    },
    async deleteBlog(_id: ObjectId) {
        const blog = await blogsCollection.findOne({_id}, {projection: {_id: 0}});
        if (blog) {
            return await blogsCollection.deleteOne(blog);
        }
        return null
    },

    async deleteAll() {
        return await blogsCollection.deleteMany({},{});
    }
}