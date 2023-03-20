
import {Request} from 'express'
import {blogViewModelWithId} from "../models/blogViewModel";
import {blogsQueryRepository} from "../repositories/query-repos/blogs-query-repository-mongodb";

/*
export const checkBlogName = async (req:Request) => {
    const blogs = await blogsQueryRepository.findBlogs()
    const blogToFind = blogs.find((blog : blogViewModelWithId) => blog.id === req.body.blogId)
    let blogName;
    if (blogToFind) {
        blogName = blogToFind.name
        return blogName
    } else
        blogName = '12546'
        return blogName;
}
*/
