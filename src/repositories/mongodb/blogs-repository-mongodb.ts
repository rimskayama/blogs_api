import {blogModelWithMongoId, blogViewModelWithId, blogViewModel} from "../../models/blog-view-model";
import {ObjectId} from "mongodb";
import {BlogModel} from "../../schemas/blog-schema";

export const blogsRepository  = {

    async findBlogName(blogId: string): Promise<blogModelWithMongoId | null> {

        let foundBlogByName = await BlogModel.findOne({_id: new ObjectId(blogId)}, {})

        return foundBlogByName || null
    },

    async createBlog(
        newBlog : blogModelWithMongoId): Promise<blogViewModelWithId> {

        const result = await BlogModel.insertMany([newBlog])
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

        const updatedBlog = await BlogModel.updateOne({_id}, {
            $set:
                {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                    isMembership: isMembership || false,
                }
        })

        const blog: blogViewModel | null = await BlogModel.findOne({_id}, {projection: {_id: 0}});
        if (blog) {
            return true
        } else
            return false
    },
    async deleteBlog(_id: ObjectId) {
        const blog = await BlogModel.findOne({_id}, {projection: {_id: 0}});
        if (blog) {
            return BlogModel.deleteOne({_id})
        }
        return null
    },

    async deleteAll() {
        return BlogModel.deleteMany({},{});
    }
}