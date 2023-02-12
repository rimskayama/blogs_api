import {Request} from 'express'
import {blogsRepository} from "../repositories/blogs-repository";
import {randomNumber} from "../repositories/randomNumber";

export const checkBlogName = (req:Request) => {
    const blogToFind = blogsRepository.findBlogs().find((blog) => blog.id === req.body.blogId)
    if (blogToFind) {
        return blogToFind.name
    } else return randomNumber(0,999999);
}
