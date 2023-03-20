import {Request, Response, Router} from 'express'
import {postsService} from "../domain/posts-service";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";
import {basicAuthMiddleware} from "../middlewares/basicAuth";
import {postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/postsBodyValidationMiddleware";
import {ObjectId} from "mongodb";
import {postsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";

export const postsRouter = Router({})
import {getPagination} from "../functions/pagination";
import {blogIdCheck} from "../functions/checkBlogId";

// get all
postsRouter.get("/posts", async (req: Request, res: Response) => {

    const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
    const allPosts = await postsQueryRepository.findPosts(page, limit, sortDirection, sortBy, skip)
    res.status(200).json(allPosts)
})

// get with uri
postsRouter.get("/posts/:id", async (req: Request, res: Response) => {
    let post = await postsQueryRepository.findPostById(new ObjectId(req.params.id));
    if (post) {
        res.json(post);
    } else res.sendStatus(404)
})

// create post
postsRouter.post("/posts",
    basicAuthMiddleware,
    blogIdCheck,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newPost = await postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId);

        if (newPost) {
            res.status(201).json(newPost)
        } else return res.sendStatus(404)
    })

// create post for spec blog

postsRouter.post("/blogs/:blogId/posts",
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

// update post
postsRouter.put("/posts/:id",
    basicAuthMiddleware,
    blogIdCheck,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,

    async (req: Request, res: Response) => {
        const isUpdated = await postsService.updatePost(
            new ObjectId(req.params.id), req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.status(404).send('Not found');
        }

    })

// delete
postsRouter.delete("/posts/:id",
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await postsService.deletePost(new ObjectId(req.params.id));
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    })
