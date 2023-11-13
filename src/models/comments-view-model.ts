import {ObjectId} from "mongodb";

export type commentViewModel = {
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
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
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
}


export type withMongoId = {
    _id: ObjectId
}

export type withViewId = {
    id: string
}

export type commentModelWithMongoId = commentModelWithPostId & withMongoId;
export type commentViewModelWithId = commentViewModel & withViewId;