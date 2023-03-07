import {postModelWithMongoId, postViewModelWithId} from "../models/postViewModel";
import {postsRepository} from "../repositories/mongodb/posts-repository-mongodb";
import {ObjectId} from "mongodb";

export const postsService = {
    async findPosts(): Promise<postViewModelWithId[]> {
        const allPosts = await postsRepository.findPosts();
        return allPosts;
    },

    async findPostById(_id: ObjectId): Promise<postViewModelWithId | null> {
        const post = await postsRepository.findPostById(_id);
        return post;

    },
    async createPost(title: string, shortDescription: string,
                     content: string, blogId: string, blogName: string) {

        const newPost : postModelWithMongoId = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: (new Date()).toISOString(),
        }
        const createdPost = await postsRepository.createPost(newPost);
        return createdPost;
    },

    async updatePost(_id: ObjectId, title: string, shortDescription: string,
                     content: string, blogId: string) {
        const updatedPost = await postsRepository.updatePost(_id, title, shortDescription, content, blogId);
        return updatedPost;
    },

    async deletePost(_id: ObjectId) {
        const deletedPost = await postsRepository.deletePost(_id);
        return deletedPost;
    },

    async deleteAll() {
        return await postsRepository.deleteAll();
    }

}