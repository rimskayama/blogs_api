import {PostsService} from "../domain/posts-service";
import {CommentsService} from "../domain/comments-service";
import {JwtService} from "../application/jwt-service";
import {PostsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";
import {CommentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {Request, Response} from "express";
import {getPagination} from "../functions/pagination";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {LikesService} from "../domain/likes-service";

@injectable()
export class PostsController {
    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(LikesService) protected likesService: LikesService,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository) {

    }
    async getPosts (req: Request, res: Response) {
        const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
        let token: string
        let userId: false | string
        if (req.headers.authorization) {
            token = req.headers.authorization!.split(' ')[1]
            userId = await this.jwtService.getUserIdByAccessToken(token)
        } else userId = false
        const allPosts = await this.postsQueryRepository.findPosts(
            page, limit, sortDirection, sortBy, skip, userId)
        res.status(200).json(allPosts)
    }
    async getPost (req: Request, res: Response) {
        let token: string
        let userId: false | string
        if (req.headers.authorization) {
        const token = req.headers.authorization!.split(' ')[1]
        userId = await this.jwtService.getUserIdByAccessToken(token)
        } else userId = false
        let post = await this.postsQueryRepository.findPostById(req.params.id, userId);
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
        let token: string
        let userId: false | string
        if (req.headers.authorization) {
            token = req.headers.authorization!.split(' ')[1]
            userId = await this.jwtService.getUserIdByAccessToken(token)
        } else userId = false

        let checkPost = await this.postsQueryRepository.findPostById(req.params.postId, userId);

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

    async updateLikeStatus (req: Request, res: Response) {
        const likeStatus = req.body.likeStatus

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByAccessToken(token)
        const post = await this.postsQueryRepository.findPostById(req.params.id, userId);

        if (!post) {
            res.sendStatus(404)
        } else {
            const checkLikeStatus = await this.likesService.checkPostLikeStatus(likeStatus, post.id, userId)
            if (checkLikeStatus) {
                const likesInfo = await this.likesService.countPostLikes(post.id)
                await this.postsQueryRepository.updatePostLikes(post.id,
                    likesInfo.likesCount, likesInfo.dislikesCount)
                return res.sendStatus(204)
            } else {
                const isCreated = await this.likesService.setPostLikeStatus(likeStatus, post, userId)
                if (isCreated) {
                    const likesInfo = await this.likesService.countPostLikes(post.id)
                    await this.postsQueryRepository.updatePostLikes(post.id,
                        likesInfo.likesCount, likesInfo.dislikesCount)
                    return res.sendStatus(204)
                } return res.sendStatus(500)
            }
        }
    }
    async deletePost (req: Request, res: Response) {
        const isDeleted = await this.postsService.deletePost(new ObjectId(req.params.id));
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    }
}