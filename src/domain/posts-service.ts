import {postModelWithMongoId, postViewModelWithId} from "../models/postViewModel";
import {postsRepository} from "../repositories/mongodb/posts-repository-mongodb";
import {ObjectId} from "mongodb";

export const postsService = {
    async findPosts(): Promise<postViewModelWithId[]> {
        return await postsRepository.findPosts();
    },

    async findPostById(_id: ObjectId): Promise<postViewModelWithId | null> {
        return await postsRepository.findPostById(_id);

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
        return await postsRepository.createPost(newPost);
    },

    async updatePost(_id: ObjectId, title: string, shortDescription: string,
                     content: string, blogId: string) {
        return await postsRepository.updatePost(_id, title, shortDescription, content, blogId);
    },

    async deletePost(_id: ObjectId) {
        return await postsRepository.deletePost(_id);
    },

    async deleteAll() {
        return await postsRepository.deleteAll();
    }

}