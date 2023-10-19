import {postModelWithMongoId, postViewModel, postViewModelWithId} from "../../models/post-view-model";
import {ObjectId} from "mongodb";
import {PostModel} from "../../schemas/post-schema";

export const postsRepository = {

    async createPost(newPost : postModelWithMongoId): Promise<postViewModelWithId> {

        const result = await PostModel.insertMany([newPost]);
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
        const updatedPost = await PostModel.updateOne({_id}, {
            $set:
                {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                }
        })

        const post: postViewModel | null = await PostModel.findOne({_id}, {projection: {_id: 0}});
        if (post) {
            return true
        } else
            return false
    },

    async deletePost(_id: ObjectId) {
        const post = await PostModel.findOne({_id},{projection: {_id: 0}});
        if (post) {
            return PostModel.deleteOne({_id});
        }
        return null
    },

    async deleteAll() {
        return PostModel.deleteMany({}, {});
    }

}