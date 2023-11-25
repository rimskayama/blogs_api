import {blogViewModel, Blog} from "../../models/blog-view-model";
import {ObjectId} from "mongodb";
import {BlogModel} from "../../schemas/blog-schema";

export class BlogsRepository {

    async findBlogName(blogId: string): Promise<Blog | null> {

        let foundBlogByName = await BlogModel.findOne({_id: new ObjectId(blogId)}, {})

        return foundBlogByName || null
    }

    async createBlog(
        newBlog : Blog): Promise<blogViewModel> {
        await BlogModel.insertMany([newBlog])
        return Blog.getViewBlog(newBlog)
    }
    async updateBlog(
        _id: ObjectId, name: string, description: string, websiteUrl: string, isMembership: boolean | false):
        Promise<blogViewModel | boolean> {

        await BlogModel.updateOne({_id}, {
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
    }
    async deleteBlog(_id: ObjectId) {
        const blog = await BlogModel.findOne({_id}, {projection: {_id: 0}});
        if (blog) {
            return BlogModel.deleteOne({_id})
        }
        return null
    }

    async deleteAll() {
        return BlogModel.deleteMany({},{});
    }

}