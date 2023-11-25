import {body} from "express-validator";
import {BlogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

const blogsRepository = new BlogsRepository();
export const blogIdCheck = body("blogId").custom(async (value) => {
    let foundBlogByName = await blogsRepository.findBlogName(value)
    if (!foundBlogByName) {
        throw new Error("ID not found");
    }
})
