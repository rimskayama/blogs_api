import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {commentContentValidationMiddleware, commentLikeValidationMiddleware,
    commentValidationMiddleware
} from "../middlewares/comments-validation-input";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {authDevicesMiddleware} from "../middlewares/auth/auth-devices";
import {jwtService} from "../application/jwt-service";
import {likesService} from "../domain/likes-service";


export const commentsRouter = Router({})

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    let userId: string | false = ''
    if (req.headers.authorization) {
        const token = req.headers.authorization!.split(' ')[1]
        userId = await jwtService.getUserIdByAccessToken(token)
    } else userId = false

    let comment = await commentsService.findCommentById(req.params.id, userId);
    if (comment) {
        res.json(comment);
    } else res.sendStatus(404)
})

commentsRouter.put("/:id",
    authDevicesMiddleware,
    commentContentValidationMiddleware,
    errorsValidationMiddleware,

    async (req: Request, res: Response) => {

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.getUserIdByAccessToken(token)

        const commentValidation = await commentValidationMiddleware(req.params.id, userId)

        if (commentValidation) {
            res.sendStatus(commentValidation.errorCode)
        } else {
        const isUpdated = await commentsService.updateComment(req.params.id, req.body.content);
                if (isUpdated) {
                    return res.sendStatus(204)
                } return res.sendStatus(500)
        }

})

commentsRouter.put("/:id/like-status",
    authDevicesMiddleware,
    commentLikeValidationMiddleware,
    errorsValidationMiddleware,

    async (req: Request, res: Response) => {
        const likeStatus = req.body.likeStatus

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.getUserIdByAccessToken(token)
        const comment = await commentsService.findCommentById(req.params.id, userId);

        if (!comment) {
            res.sendStatus(404)
        } else {
            const checkLikeStatus = await likesService.checkLikeStatus(likeStatus, comment.id, userId)
            if (checkLikeStatus) {
                await likesService.countLikes(comment.id)
                return res.sendStatus(204)
            } else {
                const isCreated = await likesService.setLikeStatus(likeStatus, comment, userId)
                if (isCreated) {
                    await likesService.countLikes(comment.id)
                    return res.sendStatus(204)
                } return res.sendStatus(500)
            }
        }
})
// get all likes
// commentsRouter.get("/:id/likes",
//     authDevicesMiddleware,
//     errorsValidationMiddleware,
//
//     async (req: Request, res: Response) => {
//         const token = req.headers.authorization!.split(' ')[1]
//         const userId = await jwtService.getUserIdByAccessToken(token)
//         const comment = await commentsService.findCommentById(req.params.id, userId);
//
//         if (!comment) {
//             res.sendStatus(404)
//         } else {
//             const commentLikes = await likesService.getCommentLikes(comment.id)
//             res.json(commentLikes)
//         }
// })

// delete
commentsRouter.delete("/:id",
    authDevicesMiddleware,
    async (req: Request, res: Response) => {

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.getUserIdByAccessToken(token)

        const commentValidation = await commentValidationMiddleware(req.params.id, userId)

        if (commentValidation) {
            res.sendStatus(commentValidation.errorCode)
        } else {

            const isDeleted = await commentsService.deleteComment(req.params.id);
            if (isDeleted) {
                return res.sendStatus(204)
            }
            return res.sendStatus(403)
        }

    })