import {Request, Response, Router} from "express";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {commentsService} from "../domain/comments-service";
import {commentContentValidationMiddleware} from "../middlewares/comments-validation-input";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {commentIdCheck} from "../middlewares/get-by-id-comments";


export const commentsRouter = Router({})

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    let comment = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id));
    if (comment) {
        res.json(comment);
    } else res.sendStatus(404)
})

commentsRouter.put("/:id",
    commentContentValidationMiddleware,
    errorsValidationMiddleware,
    authBearerMiddleware,

    async (req: Request, res: Response) => {

    const idCheck = await commentIdCheck(req.params.id)
        if (!idCheck) {
            res.sendStatus(404)
        } else {
            const token = req.headers.authorization!.split(' ')[1]; // token from req
            const commentOwnerCheck = await commentsService.getCommentOwner(token, req.params.id)

            if (commentOwnerCheck) {
                const isUpdated = await commentsService.updateComment(
                    new ObjectId(req.params.id), req.body.content);
                if (isUpdated) {
                    res.sendStatus(204)
                }
            } else res.sendStatus(403)
        }

})

// delete
commentsRouter.delete("/:id",
    authBearerMiddleware,
    async (req: Request, res: Response) => {
        const idCheck = await commentIdCheck(req.params.id)
        if (!idCheck) {
            res.sendStatus(404)
        } else {
            const token = req.headers.authorization!.split(' ')[1]; // token from req
            const commentOwnerCheck = await commentsService.getCommentOwner(token, req.params.id)

            if (commentOwnerCheck) {
                const isDeleted = await commentsService.deleteComment(new ObjectId(req.params.id));
                if (isDeleted) {
                    res.sendStatus(204)
                }
            } else res.sendStatus(403)
        }
})