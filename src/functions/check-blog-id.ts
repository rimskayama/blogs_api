import {body} from "express-validator";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

export const blogIdCheck = body("blogId").custom(async (value) => {
    let foundBlogByName = await blogsRepository.findBlogName(value)
    if (!foundBlogByName) {
        throw new Error("ID not found");
    }
})