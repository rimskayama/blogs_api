import {ObjectId} from "mongodb";

export type likeDetailsViewModel = {
    addedAt: string,
    userId: string,
    login: string
}

export type likeDetails = {
    addedAt: string,
    userId: string,
    userLogin: string
}

export class CommentLike {
    _id: ObjectId;
    addedAt: string;

    constructor(
        public commentId: string,
        public status: string,
        public userId: string,
        public userLogin: string,
    ) {
        this._id = new ObjectId();
        this.addedAt = new Date().toISOString()
    }
}

    export class PostLike {
    _id: ObjectId;
    addedAt: string;

        constructor(
        public postId: string,
        public status: string,
        public userId: string,
        public userLogin: string,
        public description: string,
    ) {
        this._id = new ObjectId();
        this.addedAt = new Date().toISOString()
    }

    static getViewLikeDetails (likeDetails: likeDetails): likeDetailsViewModel {
            return {
                addedAt: likeDetails.addedAt,
                userId: likeDetails.userId,
                login: likeDetails.userLogin
            }}
    }