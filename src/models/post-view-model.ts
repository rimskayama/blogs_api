import {ObjectId} from "mongodb";

export class Post {
    _id: ObjectId;
    createdAt: string
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string
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
}
