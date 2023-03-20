import {Request, Response, Router} from 'express'
import {postsService} from "../domain/posts-service";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";
import {basicAuthMiddleware} from "../middlewares/basicAuth";
import {postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/postsBodyValidationMiddleware";
//import {blogIdCheckMiddleware} from "../functions/checkBlogId";
import {ObjectId, SortDirection} from "mongodb";
import {postsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";

export const postsRouter = Router({})
import {getPagination} from "../functions/pagination";

//GET
postsRouter.get("/", async (req: Request, res: Response) => {

    const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
    const allPosts = await postsQueryRepository.findPosts(page, limit, sortDirection, sortBy, skip)
    res.status(200).json(allPosts)
})

//GET WITH URI
postsRouter.get("/:id", async (req: Request, res: Response) => {
    let post = await postsQueryRepository.findPostById(new ObjectId(req.params.id));
    if (post) {
        res.json(post);
    } else res.sendStatus(404)
})

//POST
postsRouter.post("/",
    basicAuthMiddleware,
    //blogIdCheckMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newPost = await postsService.createPost(
            req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId, req.body.blogName);
        console.log('new', newPost)
        res.status(201).json(newPost)
    })

//PUT
postsRouter.put("/:id",
    basicAuthMiddleware,
    //blogIdCheckMiddleware,
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

//DELETE
postsRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await postsService.deletePost(new ObjectId(req.params.id));
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    })
