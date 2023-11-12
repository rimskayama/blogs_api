import {blogModelWithMongoId} from "../models/blog-view-model";
import {postModelWithMongoId} from "../models/post-view-model";
import {userInputModel} from "../models/user-view-model";
import {commentModelWithMongoId} from "../models/comments-view-model";
import {deviceInputModel} from "../models/device-model";

export const blogsMapping = (array: blogModelWithMongoId[]) => {
    return array.map((obj) => {
        return {
            id: obj._id.toString(),
            name: obj.name,
            description: obj.description,
            websiteUrl: obj.websiteUrl,
            createdAt: obj.createdAt,
            isMembership: obj.isMembership
        }
    })
}
export const postsMapping = (array : postModelWithMongoId[]) => {
    return array.map((obj) => {
        return {
            id: obj._id.toString(),
            title: obj.title,
            shortDescription: obj.shortDescription,
            content: obj.content,
            blogId: obj.blogId,
            blogName: obj.blogName,
            createdAt: obj.createdAt,
        };
    })
}

export const usersMapping = (array : userInputModel[]) => {
    return array.map((obj) => {
        return {
            id: obj._id.toString(),
            login: obj.accountData.login,
            email: obj.accountData.email,
            createdAt: obj.accountData.createdAt,
        };
    })
}

export const commentsMapping = (array: commentModelWithMongoId[]) => {
    return array.map((obj) => {
        return {
            id: obj._id.toString(),
            content: obj.content,
            commentatorInfo: {
                userId: obj.commentatorInfo.userId,
                userLogin: obj.commentatorInfo.userLogin
            },
            createdAt: obj.createdAt,
            likesInfo: {
                likesCount: obj.likesInfo.likesCount,
                dislikesCount: obj.likesInfo.dislikesCount,
                myStatus: obj.likesInfo.myStatus
            }
        };
    })
}

export const devicesMapping = (array: deviceInputModel[]) => {
    return array.map((obj) => {
        return {
            ip: obj.ip,
            title: obj.title,
            lastActiveDate: obj.lastActiveDate,
            deviceId: obj.deviceId,
        };
    })
}

