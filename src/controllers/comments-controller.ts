import {CommentsService} from "../domain/comments-service";
import {LikesService} from "../domain/likes-service";
import {CommentsRepository} from "../repositories/mongodb/comments-repository-mongodb";
import {CommentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {JwtService} from "../application/jwt-service";
import {Request, Response} from "express";
import {commentValidationMiddleware} from "../middlewares/comments-validation-input";

export class CommentsController {
    constructor(
        protected commentsService: CommentsService,
        protected likesService: LikesService,
        protected commentsRepository: CommentsRepository,
        protected commentsQueryRepository: CommentsQueryRepository,
        protected jwtService: JwtService
    ) {
    }
    async getComment (req: Request, res: Response) {
        let userId: string | false
        if (req.headers.authorization) {
            const token = req.headers.authorization!.split(' ')[1]
            userId = await this.jwtService.getUserIdByAccessToken(token)
        } else userId = false
        let comment = await this.commentsService.findCommentById(req.params.id, userId);
        if (comment) {
            res.json(comment);
        } else res.sendStatus(404)
    }

    async updateComment (req: Request, res: Response) {
        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByAccessToken(token)
        const commentValidation = await commentValidationMiddleware(req.params.id, userId)
        if (commentValidation) {
            res.sendStatus(commentValidation.errorCode)
        } else {
            const isUpdated = await this.commentsService.updateComment(req.params.id, req.body.content);
            if (isUpdated) {
                return res.sendStatus(204)
            } return res.sendStatus(500)
        }
    }

    async updateLikeStatus (req: Request, res: Response) {
        const likeStatus = req.body.likeStatus

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByAccessToken(token)
        const comment = await this.commentsService.findCommentById(req.params.id, userId);

        if (!comment) {
            res.sendStatus(404)
        } else {
            const checkLikeStatus = await this.likesService.checkLikeStatus(likeStatus, comment.id, userId)
            if (checkLikeStatus) {
                const likesInfo = await this.likesService.countLikes(comment.id)//likesCount, dislikesCount
                await this.commentsRepository.updateCommentLikes(comment.id,
                    likesInfo.likesCount, likesInfo.dislikesCount)
                return res.sendStatus(204)
            } else {
                const isCreated = await this.likesService.setLikeStatus(likeStatus, comment, userId)
                if (isCreated) {
                    const likesInfo = await this.likesService.countLikes(comment.id)
                    await this.commentsRepository.updateCommentLikes(comment.id,
                        likesInfo.likesCount, likesInfo.dislikesCount)
                    return res.sendStatus(204)
                } return res.sendStatus(500)
            }
        }
    }

    async deleteComment (req: Request, res: Response) {
        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByAccessToken(token)

        const commentValidation = await commentValidationMiddleware(req.params.id, userId)

        if (commentValidation) {
            res.sendStatus(commentValidation.errorCode)
        } else {
            const isDeleted = await this.commentsService.deleteComment(req.params.id);
            if (isDeleted) {
                return res.sendStatus(204)
            }
            return res.sendStatus(403)
        }
    }
}