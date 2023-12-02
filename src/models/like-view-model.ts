import {ObjectId} from "mongodb";

export type likeViewModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export class Like {
    _id: ObjectId;
    lastModified: string;
    constructor(
        public commentId: string,
        public status: string,
        public userId: string,
        public userLogin: string,
    ) {
        this._id = new ObjectId();
        this.lastModified = new Date().toISOString()
    }
}