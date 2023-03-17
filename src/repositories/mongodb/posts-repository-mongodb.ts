import {postModelWithMongoId, postViewModel, postViewModelWithId} from "../../models/postViewModel";
import {postsCollection} from "../db";
import {ObjectId} from "mongodb";

export const postsRepository = {

    async createPost(newPost : postModelWithMongoId): Promise<postViewModelWithId> {

        const result = await postsCollection.insertOne(newPost);
        return {
            id: newPost._id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
        }
    },

    async updatePost(_id: ObjectId, title: string, shortDescription: string,
                     content: string, blogId: string) {
        const updatedPost = await postsCollection.updateOne({_id}, {
            $set:
                {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                }
        })

        const post: postViewModel | null = await postsCollection.findOne({_id}, {projection: {_id: 0}});
        if (post) {
            return true
        } else
            return false
    },

    async deletePost(_id: ObjectId) {
        const post = await postsCollection.findOne({_id},{projection: {_id: 0}});
        if (post) {
            return await postsCollection.deleteOne(post);
        }
        return null
    },

    async deleteAll() {
        return await postsCollection.deleteMany({},{});
    }

}