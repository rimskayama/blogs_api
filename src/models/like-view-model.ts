import {ObjectId} from "mongodb";

export type likeViewModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export type likeInfoModel = {
    _id: ObjectId,
    commentId: ObjectId,
    status: string,
    userId: ObjectId,
    userLogin: string,
    lastModified: string
}