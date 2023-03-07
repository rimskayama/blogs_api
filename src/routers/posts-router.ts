import {Request, Response, Router} from 'express'
import {postsService} from "../domain/posts-service";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";
import {basicAuthMiddleware} from "../middlewares/basicAuth";
import {postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/postsBodyValidationMiddleware";
import {blogIdCheckMiddleware} from "../functions/checkBlogId";
import {checkBlogName} from "../functions/checkBlogName";
import {ObjectId} from "mongodb";

export const postsRouter = Router({})

//GET
postsRouter.get("/", async (req: Request, res: Response) => {
    const allPosts = await postsService.findPosts()
    res.status(200).json(allPosts)
})

//GET WITH URI
postsRouter.get("/:id", async (req: Request, res: Response) => {
    let post = await postsService.findPostById(new ObjectId(req.params.id));
    if (post) {
        res.json(post);
    } else res.sendStatus(404)
})

//POST
postsRouter.post("/",
    basicAuthMiddleware,
    blogIdCheckMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newPost = await postsService.createPost(
            req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId, await checkBlogName(req));
        console.log('new', newPost)
        res.status(201).json(newPost)
    })

//PUT
postsRouter.put("/:id",
    basicAuthMiddleware,
    blogIdCheckMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,

    async (req: Request, res: Response) => {
        const updatedPost = await postsService.updatePost(
            new ObjectId(req.params.id), req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        if (updatedPost) {
            res.sendStatus(204);
        } else {
            res.status(404).send('Not found');
        }

    })

//DELETE
postsRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await postsService.deletePost(new ObjectId(req.params.id));
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    })


