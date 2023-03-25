import {ObjectId} from "mongodb";

export type postViewModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};


export type withMongoId = {
    _id: ObjectId
}

export type withViewId = {
    id: string
}
export type postModelWithMongoId = postViewModel & withMongoId;
export type postViewModelWithId = postViewModel & withViewId;
