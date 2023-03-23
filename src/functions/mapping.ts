
import {blogModelWithMongoId} from "../models/blogViewModel";
import {postModelWithMongoId} from "../models/postViewModel";
import {userModelWithMongoId} from "../models/userViewModel";

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

export const usersMapping = (array : userModelWithMongoId[]) => {
    return array.map((obj) => {
        return {
            id: obj._id.toString(),
            userName: obj.userName,
            email: obj.email,
            passwordHash: obj.passwordHash,
            passwordSalt: obj.passwordSalt,
            createdAt: obj.createdAt,
        };
    })
}
