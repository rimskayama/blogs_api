import {Request, Response, Router} from 'express'
import {blogsService} from "../domain/blogs-service";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {blogDescriptionValidationMiddleware,
    blogNameValidationMiddleware, blogWebsiteUrlValidationMiddleware
} from "../middlewares/blogs-validation-input";
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {ObjectId} from "mongodb";
import {blogsQueryRepository} from "../repositories/query-repos/blogs-query-repository-mongodb";


export const blogsRouter = Router({})

import {getPagination} from "../functions/pagination";
import {postsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";
import {
    postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/posts-validation-input";
import {postsService} from "../domain/posts-service";

// get all
blogsRouter.get("/", async (req: Request, res: Response) =>  {
    const {page, limit, sortDirection, sortBy, searchNameTerm, skip} = getPagination(req.query);
    const allBlogs = await blogsQueryRepository.findBlogs(page, limit, sortDirection, sortBy, searchNameTerm, skip)
    res.status(200).json(allBlogs)
})


// get with uri
blogsRouter.get("/:id", async (req: Request, res: Response) => {
    let blog = await blogsQueryRepository.findBlogById(new ObjectId(req.params.id))
    if (blog) {
        res.json(blog);
    } else res.sendStatus(404)
})

// get posts with blog id
blogsRouter.get("/:blogId/posts", async (req: Request, res: Response) => {

    let checkBlog = await blogsQueryRepository.findBlogByBlogId(req.params.blogId);

    const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
    const blogId = req.params.blogId;

    if (checkBlog) {
        let posts = await postsQueryRepository.findPostsByBlogId(blogId, page, limit, sortDirection, sortBy, skip);
        res.status(200).json(posts);
    } else res.sendStatus(404)
})

// create blog
blogsRouter.post("/",
    basicAuthMiddleware,
    blogNameValidationMiddleware,
    blogDescriptionValidationMiddleware,
    blogWebsiteUrlValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newBlog = await blogsService.createBlog(new ObjectId(req.params.id), req.body.name,
            req.body.description, req.body.websiteUrl, req.body.isMembership);
        res.status(201).json(newBlog)
})

// create post for spec blog

blogsRouter.post("/:blogId/posts",
    basicAuthMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newPost = await postsService.createPost(
            req.body.title, req.body.shortDescription,
            req.body.content,  req.params.blogId);

        if (newPost) {
            res.status(201).json(newPost)
        } else return res.sendStatus(404)

    })

// update blog
blogsRouter.put("/:id",
    basicAuthMiddleware,
    blogNameValidationMiddleware,
    blogDescriptionValidationMiddleware,
    blogWebsiteUrlValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
    const updatedBlog = await blogsService.updateBlog(
        new ObjectId(req.params.id), req.body.name, req.body.description,
        req.body.websiteUrl, req.body.isMembership
    )
    if (updatedBlog) {
        res.sendStatus(204);
    } else {
        res.status(404).send('Not Found');
    }

})

// delete
blogsRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
    const result = await blogsService.deleteBlog(new ObjectId(req.params.id));
    (result) ? res.sendStatus(204) : res.sendStatus(404);
})


