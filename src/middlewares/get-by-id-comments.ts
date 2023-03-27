import {param} from "express-validator";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";

export const commentIdCheck = param("id").custom(async (value) => {
    let foundCommentById = await commentsQueryRepository.findCommentById(value)
    if (!foundCommentById) {
        throw new Error("ID not found");
    }
})