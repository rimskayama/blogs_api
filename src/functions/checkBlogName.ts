import {Request} from 'express'
import {blogsRepository} from "../repositories/blogs-repository";
import {randomNumber} from "../repositories/randomNumber";

export const checkBlogName = (req:Request) => {
    const blogToFind = blogsRepository.findBlogs().find((blog) => blog.id === req.body.blogId)
    let blogName;
    if (blogToFind) {
        blogName = blogToFind.name
        return blogName
    } else
        blogName = '12546'
        return blogName;
}
