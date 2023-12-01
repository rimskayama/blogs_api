import {Post} from "../models/post-view-model";
import {PostsRepository} from "../repositories/mongodb/posts-repository-mongodb";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";
import {PostsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";

export class PostsService {
    constructor(
        protected blogsRepository: BlogsRepository,
        protected postsRepository: PostsRepository,
        protected postsQueryRepository: PostsQueryRepository
    ) {
    }

    async createPost (title: string, shortDescription: string,
                     content: string, blogId: string) {

        let foundBlogByName = await this.blogsRepository.findBlogName(blogId.toString())

        if (foundBlogByName) {
            const newPost = new Post(title, shortDescription, content, blogId, foundBlogByName.name)
            return await this.postsRepository.createPost(newPost);
        } else return null

    }

    async updatePost(_id: ObjectId, title: string, shortDescription: string,
                     content: string, blogId: string) {

        let foundBlogByName = await this.blogsRepository.findBlogName(blogId)

        if (foundBlogByName) {
            return await this.postsRepository.updatePost(_id, title, shortDescription, content, blogId);
        }

    }

    async deletePost(_id: ObjectId) {
        return await this.postsRepository.deletePost(_id);
    }

    async deleteAll() {
        return await this.postsRepository.deleteAll();
    }

}