import {body} from "express-validator";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

export const blogIdCheckMiddleware = body("blogId").custom(async (value) => {
    const blogs = await blogsRepository.findBlogs();
    const result = blogs.filter((el) => el.id === value);
    if (result.length < 1) {
        throw new Error("ID not found");
    }
});

