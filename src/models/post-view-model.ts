import {ObjectId} from "mongodb";
import {likeDetails, likeDetailsViewModel} from "./like-view-model";
import {likeDetailsMapping} from "../functions/mapping";

export class Post {
    _id: ObjectId;
    createdAt: string
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string,
            newestLikes: likeDetails[]
    }
    ) {
       this._id = new ObjectId();
       this.createdAt = new Date().toISOString()
    }
    static getViewPost(postFromDb: Post): postViewModel {
        return {
            id: postFromDb._id.toString(),
            title: postFromDb.title,
            shortDescription: postFromDb.shortDescription,
            content: postFromDb.content,
            blogId: postFromDb.blogId,
            blogName: postFromDb.blogName,
            createdAt: postFromDb.createdAt,
            extendedLikesInfo: {
                likesCount: postFromDb.extendedLikesInfo.likesCount,
                dislikesCount: postFromDb.extendedLikesInfo.dislikesCount,
                myStatus: postFromDb.extendedLikesInfo.myStatus,
                newestLikes: likeDetailsMapping(postFromDb.extendedLikesInfo.newestLikes)
            }

        }
    }
}

export type postViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: likeDetailsViewModel[]
    }
}
