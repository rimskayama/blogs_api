import {Blog, blogViewModel} from "../models/blog-view-model";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";
import {BlogsQueryRepository} from "../repositories/query-repos/blogs-query-repository-mongodb";

export class BlogsService {
    blogsRepository: BlogsRepository
    blogsQueryRepository: BlogsQueryRepository
    constructor() {
        this.blogsRepository = new BlogsRepository()
        this.blogsQueryRepository = new BlogsQueryRepository()
    }
    async createBlog(name: string, description: string, websiteUrl: string): Promise<blogViewModel> {

        const newBlog = new Blog(name, description, websiteUrl)

        return await this.blogsRepository.createBlog(newBlog);
    }

    async updateBlog(_id: ObjectId, name: string, description: string, websiteUrl: string, isMembership: boolean | false):
        Promise<blogViewModel | boolean> {

        return await this.blogsRepository.updateBlog(_id, name, description, websiteUrl, isMembership);

    }

    async deleteBlog(_id: ObjectId) {
        return await this.blogsRepository.deleteBlog(_id);
    }

    async deleteAll() {
        return await this.blogsRepository.deleteAll();
    }
}