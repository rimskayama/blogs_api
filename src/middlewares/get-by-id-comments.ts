import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";

export const commentIdCheck = async (id: string) => {
    let foundCommentById = await commentsQueryRepository.findCommentById(new ObjectId(id))
    if (!foundCommentById) {
        return false
    } return true
}