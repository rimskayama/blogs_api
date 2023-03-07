import {Request} from 'express'
import {blogViewModelWithId} from "../models/blogViewModel";
import {blogsService} from "../domain/blogs-service";


export const checkBlogName = async (req:Request) => {
    const blogs = await blogsService.findBlogs()
    const blogToFind = blogs.find((blog : blogViewModelWithId) => blog.id === req.body.blogId)
    let blogName;
    if (blogToFind) {
        blogName = blogToFind.name
        return blogName
    } else
        blogName = '12546'
        return blogName;
}
