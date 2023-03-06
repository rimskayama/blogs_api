import {Request} from 'express'
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";
import {blogViewModelWithId} from "../models/blogViewModel";


export const checkBlogName = async (req:Request) => {
    const blogs = await blogsRepository.findBlogs()
    const blogToFind = blogs.find((blog : blogViewModelWithId) => blog.id === req.body.blogId)
    let blogName;
    if (blogToFind) {
        blogName = blogToFind.name
        return blogName
    } else
        blogName = '12546'
        return blogName;
}
