
import {blogModelWithMongoId} from "../models/blogViewModel";
import {postModelWithMongoId} from "../models/postViewModel";

export const blogsMapping = (array: Array<blogModelWithMongoId>) => {
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
export const postsMapping = (array : Array<postModelWithMongoId>) => {
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
