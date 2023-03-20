import {body} from "express-validator";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";
import {ObjectId} from "mongodb";

export const blogIdCheckMiddleware = body("blogId").custom(async (value) => {
    let foundBlogByName = await blogsRepository.findBlogName(new ObjectId(value))
    if (!foundBlogByName) {
        throw new Error("ID not found");
    }
});
