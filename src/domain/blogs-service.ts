import {Blog, blogViewModel} from "../models/blog-view-model";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";
import {BlogsQueryRepository} from "../repositories/query-repos/blogs-query-repository-mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository) {
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