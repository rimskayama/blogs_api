import {Request, Response, Router} from 'express'
import {postsRepository} from "../repositories/posts-repository";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";
import {basicAuthMiddleware} from "../middlewares/basicAuth";
import {
    checkBlogIdMiddleware,
    postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/postsBodyValidationMiddleware";


export const postsRouter = Router({})

//GET
postsRouter.get("/", (req: Request, res: Response) => {
    const allPosts = postsRepository.findPosts(req.body.name)
    res.status(200).json(allPosts)
})


//GET WITH URI
postsRouter.get("/:id", (req: Request, res: Response) => {
    let post = postsRepository.findPostById(req.params.id);
    if (post) {
        res.json(post);
    } else res.sendStatus(404)
})

//POST
postsRouter.post("/",
    basicAuthMiddleware,
    checkBlogIdMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    (req: Request, res: Response) => {

        const newPost = postsRepository.createPost(
            req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName);
        console.log('new', newPost)
        res.status(201).json(newPost)
    })

//PUT
postsRouter.put("/:id",
    basicAuthMiddleware,
    checkBlogIdMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    (req: Request, res: Response) => {
        const updatedPost = postsRepository.updatePost(
            req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName)
        if (updatedPost) {
            res.sendStatus(204);
        } else {
            res.status(400).send('error');
        }

    })

//DELETE
postsRouter.delete("/:id",
    basicAuthMiddleware,
    (req: Request, res: Response) => {
        const isDeleted = postsRepository.deletePost(req.params.id);
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    })


