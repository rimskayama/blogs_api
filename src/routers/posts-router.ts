import {Request, Response, Router} from 'express'
import {postsService} from "../domain/posts-service";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/posts-validation-input";
import {ObjectId} from "mongodb";
import {postsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";

export const postsRouter = Router({})
import {getPagination} from "../functions/pagination";
import {blogIdCheck} from "../functions/check-blog-id";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {commentsService} from "../domain/comments-service";
import {commentContentValidationMiddleware} from "../middlewares/comments-validation-input";

// get all
postsRouter.get("/", async (req: Request, res: Response) => {

    const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
    const allPosts = await postsQueryRepository.findPosts(page, limit, sortDirection, sortBy, skip)
    res.status(200).json(allPosts)
})

// get with uri
postsRouter.get("/:id", async (req: Request, res: Response) => {
    let post = await postsQueryRepository.findPostById(new ObjectId(req.params.id));
    if (post) {
        res.json(post);
    } else res.sendStatus(404)
})

// create post
postsRouter.post("/",
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

// get comments by postId
postsRouter.get("/:postId/comments",
    async (req: Request, res: Response) => {
    let checkPost = await postsQueryRepository.findPostById(new ObjectId(req.params.postId));

    const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
    const postId = req.params.postId;

    if (checkPost) {
        let comments = await commentsQueryRepository.findCommentsByPostId(postId, page, limit, sortDirection, sortBy, skip);
        res.status(200).json(comments);
    } else res.sendStatus(404)
})
// create comment by postId
postsRouter.post('/:postId/comments',
    authBearerMiddleware,
    commentContentValidationMiddleware,
    errorsValidationMiddleware,
    async (req, res) => {

        const newComment = await commentsService.createComment(req.body.content, req.user!.id, req.params.postId)

        if (newComment) {
            res.status(201).json(newComment)
        } else return res.sendStatus(404)
    })

// update post
postsRouter.put("/:id",
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
            res.status(404).json('Not found');
        }

    })

// delete
postsRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await postsService.deletePost(new ObjectId(req.params.id));
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    })
