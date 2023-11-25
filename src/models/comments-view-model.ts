import {ObjectId} from "mongodb";

export type commentViewModel = {
    id: string,
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

export class Comment {
    _id: ObjectId;
    createdAt: string
    constructor(
    public postId: string,
    public content: string,
    public commentatorInfo: {
        userId: string,
        userLogin: string
    },
    public likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }) {
        this._id = new ObjectId();
        this.createdAt = new Date().toISOString()
    }
    static getViewComment(commentFromDb: Comment): commentViewModel {
        return {
            id: commentFromDb._id.toString(),
            content: commentFromDb.content,
            commentatorInfo: {
                userId: commentFromDb.commentatorInfo.userId,
                userLogin: commentFromDb.commentatorInfo.userLogin
            },
            createdAt: commentFromDb.createdAt,
            likesInfo: {
                likesCount: commentFromDb.likesInfo.likesCount,
                dislikesCount: commentFromDb.likesInfo.dislikesCount,
                myStatus: commentFromDb.likesInfo.myStatus
            }
        }
    }
}