import {ObjectId} from "mongodb";

export type likeViewModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export type likeInfoModel = {
    _id: ObjectId,
    commentId: string,
    status: string,
    userId: string,
    userLogin: string,
    lastModified: string
}