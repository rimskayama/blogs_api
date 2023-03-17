import {postModelWithMongoId, postViewModelWithId} from "../../models/postViewModel";
import {postsCollection} from "../db";
import {postsMapping} from "../../functions/mapping";
import {ObjectId} from "mongodb";

export const postsQueryRepository = {

    async findPosts(): Promise<postViewModelWithId[]> {
        let allPosts = postsCollection.find({}, {}).toArray();
        return postsMapping(await allPosts);
    },

    async findPostById(_id: ObjectId): Promise<postViewModelWithId | null> {
        const post: postModelWithMongoId | null = await postsCollection.findOne({_id});
        if (!post) {
            return null;
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };

    }
}