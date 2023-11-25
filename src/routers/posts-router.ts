import {Request, Response, Router} from 'express'
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/posts-validation-input";
import {ObjectId} from "mongodb";
import {getPagination} from "../functions/pagination";
import {blogIdCheck} from "../functions/check-blog-id";
import {CommentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {CommentsService} from "../domain/comments-service";
import {commentContentValidationMiddleware} from "../middlewares/comments-validation-input";
import {authDevicesMiddleware} from "../middlewares/auth/auth-devices";
import {PostsService} from "../domain/posts-service";
import {PostsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";
import {JwtService} from "../application/jwt-service";
export const postsRouter = Router({})

class PostsController {
    private postsService: PostsService;
    private commentsService: CommentsService;
    private jwtService: JwtService;
    private postsQueryRepository: PostsQueryRepository;
    private commentsQueryRepository: CommentsQueryRepository;

    constructor() {
        this.postsService = new PostsService()
        this.commentsService = new CommentsService()
        this.jwtService = new JwtService()
        this.postsQueryRepository = new PostsQueryRepository()
        this.commentsQueryRepository = new CommentsQueryRepository()
    }
    async getPosts (req: Request, res: Response) {
        const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
        const allPosts = await this.postsQueryRepository.findPosts(page, limit, sortDirection, sortBy, skip)
        res.status(200).json(allPosts)
    }
    async getPost (req: Request, res: Response) {
        let post = await this.postsQueryRepository.findPostById(new ObjectId(req.params.id));
        if (post) {
            res.json(post);
        } else res.sendStatus(404)
    }
    async createPost (req: Request, res: Response) {
        const newPost = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId);
        if (newPost) {
            res.status(201).json(newPost)
        } else return res.sendStatus(404)
    }
    async getCommentsOfPost (req: Request, res: Response) {
        let checkPost = await this.postsQueryRepository.findPostById(new ObjectId(req.params.postId));
        let userId: string | false
        if (req.headers.authorization) {
            const token = req.headers.authorization!.split(' ')[1]
            userId = await this.jwtService.getUserIdByAccessToken(token)
        } else userId = false

        const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
        const postId = req.params.postId;

        if (checkPost) {
            let comments = await this.commentsQueryRepository.findCommentsByPostId(
                postId, page, limit, sortDirection, sortBy, skip, userId);
            res.status(200).json(comments);
        } else res.sendStatus(404)
    }
    async createCommentByPostId (req: Request, res: Response) {
        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByAccessToken(token)
        let newComment = null
        if (userId) {
            newComment = await this.commentsService.createComment
            (req.body.content, userId, req.params.postId)
        }
        if (newComment) {
            res.status(201).json(newComment)
        } else return res.sendStatus(404)
    }
    async updatePost (req: Request, res: Response) {
        const isUpdated = await this.postsService.updatePost(
            new ObjectId(req.params.id), req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId)
        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.status(404).json('Not found');
        }
    }
    async deletePost (req: Request, res: Response) {
        const isDeleted = await this.postsService.deletePost(new ObjectId(req.params.id));
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    }
}

const postsController = new PostsController()

postsRouter.get("/", postsController.getPosts.bind(postsController))
postsRouter.get("/:id", postsController.getPost.bind(postsController))
postsRouter.post("/",
    basicAuthMiddleware,
    blogIdCheck,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    postsController.createPost.bind(postsController))
postsRouter.get("/:postId/comments", postsController.getCommentsOfPost.bind(postsController))

postsRouter.post('/:postId/comments',
    authDevicesMiddleware,
    commentContentValidationMiddleware,
    errorsValidationMiddleware,
    postsController.createCommentByPostId.bind(postsController))

postsRouter.put("/:id",
    basicAuthMiddleware,
    blogIdCheck,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    postsController.updatePost.bind(postsController))

postsRouter.delete("/:id",
    basicAuthMiddleware,
    postsController.deletePost.bind(postsController))
