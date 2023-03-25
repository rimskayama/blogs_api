import {blogModelWithMongoId, blogViewModelWithId} from "../models/blog-view-model";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

export const blogsService  = {

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
        return await blogsRepository.createBlog(newBlog);
    },

    async updateBlog(_id: ObjectId, name: string, description: string, websiteUrl: string, isMembership: boolean | false):
        Promise<blogViewModelWithId | boolean> {

        return await blogsRepository.updateBlog(_id, name, description, websiteUrl, isMembership);

    },

    async deleteBlog(_id: ObjectId) {
        return await blogsRepository.deleteBlog(_id);
    },

    async deleteAll() {
        return await blogsRepository.deleteAll();
    }
}