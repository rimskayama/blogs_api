import {Request, Response, Router} from "express";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {commentsService} from "../domain/comments-service";
import {
    commentContentValidationMiddleware,
    commentValidationMiddleware
} from "../middlewares/comments-validation-input";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {authDevicesMiddleware} from "../middlewares/auth/auth-devices";
import {devicesService} from "../domain/devices-service";


export const commentsRouter = Router({})

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    let comment = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id));
    if (comment) {
        res.json(comment);
    } else res.sendStatus(404)
})

commentsRouter.put("/:id",
    authDevicesMiddleware,
    commentContentValidationMiddleware,
    errorsValidationMiddleware,

    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(401)
        }
        const session = await devicesService.getSession(refreshToken)
        let commentValidation = null
        if (session) {
            commentValidation = await commentValidationMiddleware(req.params.id, session)
        }

        if (commentValidation) {
            res.sendStatus(commentValidation.errorCode)
        } else {
        const isUpdated = await commentsService.updateComment(
                    new ObjectId(req.params.id), req.body.content);
                if (isUpdated) {
                    return res.sendStatus(204)
                } return res.sendStatus(500)
        }

})

// delete
commentsRouter.delete("/:id",
    authDevicesMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(401)
        }
        const session = await devicesService.getSession(refreshToken)
        let commentValidation = null
        if (session) {
            commentValidation = await commentValidationMiddleware(req.params.id, session)
        }

        if (commentValidation) {
            res.sendStatus(commentValidation.errorCode)
        } else {

            const isDeleted = await commentsService.deleteComment(new ObjectId(req.params.id));
            if (isDeleted) {
                return res.sendStatus(204)
            }
            return res.sendStatus(403)
        }

    })