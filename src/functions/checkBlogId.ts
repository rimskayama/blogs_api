import {body} from "express-validator";
import {blogsQueryRepository} from "../repositories/query-repos/blogs-query-repository-mongodb";

export const blogIdCheckMiddleware = body("blogId").custom(async (value) => {
    const blogs = await blogsQueryRepository.findBlogs();
    const result = blogs.filter((el) => el.id === value);
    if (result.length < 1) {
        throw new Error("ID not found");
    }
});

