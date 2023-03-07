import {blogModelWithMongoId, blogViewModelWithId} from "../models/blogViewModel";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

export const blogsService  = {
        async findBlogs(): Promise<blogViewModelWithId[]> {
            return blogsRepository.findBlogs()
        },

        async findBlogById(_id: ObjectId): Promise<blogViewModelWithId | null> {
            const blog: blogViewModelWithId | null = await blogsRepository.findBlogById(_id);
            return blog;
    },

    async createBlog(_id: ObjectId, name: string, description: string,
                     websiteUrl: string, isMembership: boolean): Promise<blogViewModelWithId> {

        const newBlog: blogModelWithMongoId = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: (new Date()).toISOString(),
            isMembership: isMembership || false,
        }
        const createdBlog = await blogsRepository.createBlog(newBlog);
        return createdBlog;
    },

    async updateBlog(_id: ObjectId, name: string, description: string, websiteUrl: string, isMembership: boolean | false):
        Promise<blogViewModelWithId | boolean> {

        const updatedBlog = await blogsRepository.updateBlog(_id, name, description, websiteUrl, isMembership);
        return updatedBlog;
    },

    async deleteBlog(_id: ObjectId) {
        const deletedBlog = await blogsRepository.deleteBlog(_id);
        return deletedBlog;
    },

    async deleteAll() {
        return await blogsRepository.deleteAll();
    }
}