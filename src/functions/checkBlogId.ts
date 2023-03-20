import {body} from "express-validator";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

export const blogIdCheck = body("blogId").custom(async (value) => {
    let foundBlogByName = await blogsRepository.findBlogName(value)
    if (!foundBlogByName) {
        throw new Error("ID not found");
    }
})

/*
export const blogIdCheckQuery = param("blogId").custom(async (value) => {
    let foundBlogByName = await blogsRepository.findBlogName(value)
    if (!foundBlogByName) {
        return null;
    }})

     export const funcBlogIdCheck = async (req: Request) => {
        let foundBlogByName = await blogsRepository.findBlogName(req.params.blogId)
        if (!foundBlogByName) {
            return null
        } else return

}

 */
