import {Request, Response, Router} from 'express'
import {postsRepository} from "../repositories/memory/posts-repository-memory";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";
import {basicAuthMiddleware} from "../middlewares/basicAuth";
import {
    blogIdValidationMiddleware,
    postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/postsBodyValidationMiddleware";
//import {blogIdCheckMiddleware} from "../functions/checkBlogId";
import {checkBlogName} from "../functions/checkBlogName";

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
    blogIdValidationMiddleware,
    //blogIdCheckMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newPost = postsRepository.createPost(
            req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId, await checkBlogName(req));
        console.log('new', newPost)
        res.status(201).json(newPost)
    })

//PUT
postsRouter.put("/:id",
    basicAuthMiddleware,
    blogIdValidationMiddleware,
    //blogIdCheckMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,

    async (req: Request, res: Response) => {
        const updatedPost = postsRepository.updatePost(
            req.params.id, req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId, await checkBlogName(req))
        if (updatedPost) {
            res.sendStatus(204);
        } else {
            res.status(404).send('Not found');
        }

    })

//DELETE
postsRouter.delete("/:id",
    basicAuthMiddleware,
    blogIdValidationMiddleware,
    //blogIdCheckMiddleware,
    (req: Request, res: Response) => {
        const isDeleted = postsRepository.deletePost(req.params.id);
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    })


