import {postModelWithMongoId, postViewModel, postViewModelWithId} from "../../models/postViewModel";
import {postsCollection} from "../db";
import {postsMapping} from "../../functions/mapping";
import {ObjectId} from "mongodb";

export const postsRepository = {
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

    },
    async createPost(_id: ObjectId, title: string, shortDescription: string,
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
                     content: string, blogId: string, blogName: string) {
        const updatedPost = await postsCollection.updateOne({_id}, {
            $set:
                {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    blogName: blogName,
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