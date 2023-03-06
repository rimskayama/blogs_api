
import {blogsCollection} from "../db";
import {blogModelWithMongoId, blogViewModelWithId, blogViewModel} from "../../models/blogViewModel";
import {ObjectId} from "mongodb";
import {blogsMapping} from "../../functions/mapping";

export const blogsRepository  = {
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
    },

    async createBlog(
        _id: ObjectId, name: string, description: string, websiteUrl: string, isMembership: boolean): Promise<blogViewModelWithId> {

        const newBlog: blogModelWithMongoId = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: (new Date()).toISOString(),
            isMembership: isMembership || false,
        }
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