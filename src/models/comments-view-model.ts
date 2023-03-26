import {ObjectId} from "mongodb";

export type commentViewModel = {
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string,
}

export type commentModelWithPostId = {
    _id: ObjectId,
    postId: string,
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string,
}


export type withMongoId = {
    _id: ObjectId
}

export type withViewId = {
    id: string
}

export type commentModelWithMongoId = commentViewModel & withMongoId;
export type commentViewModelWithId = commentViewModel & withViewId;