import {Post, postViewModel} from "../../models/post-view-model";
import {ObjectId} from "mongodb";
import {PostModel} from "../../schemas/post-schema";

export class PostsRepository {

    async createPost(newPost : Post): Promise<postViewModel> {

        await PostModel.insertMany([newPost]);
        return Post.getViewPost(newPost)
    }

    async updatePost(_id: ObjectId, title: string, shortDescription: string,
                     content: string, blogId: string) {
        await PostModel.updateOne({_id}, {
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
    }

    async deletePost(_id: ObjectId) {
        const post = await PostModel.findOne({_id},{projection: {_id: 0}});
        if (post) {
            return PostModel.deleteOne({_id});
        }
        return null
    }

    async deleteAll() {
        return PostModel.deleteMany({}, {});
    }

}