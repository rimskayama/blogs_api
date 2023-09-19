import {Request, Response, Router} from "express";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {commentsService} from "../domain/comments-service";
import {
    commentContentValidationMiddleware,
    commentValidationMiddleware
} from "../middlewares/comments-validation-input";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";


export const commentsRouter = Router({})

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    let comment = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id));
    if (comment) {
        res.json(comment);
    } else res.sendStatus(404)
})

commentsRouter.put("/:id",
    authBearerMiddleware,
    commentContentValidationMiddleware,
    errorsValidationMiddleware,

    async (req: Request, res: Response) => {
    const user = req.user;

        const commentValidation = await commentValidationMiddleware(req.params.id, user!)
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
    authBearerMiddleware,
    async (req: Request, res: Response) => {
        const user = req.user;
        const comment = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id))
        if (!comment) {
            return res.sendStatus(404)
        }
        if (comment.commentatorInfo.userId !== user!.id) {
            return res.sendStatus(403);
        }
        // const getCommentOwner = await commentsService.getCommentOwner(req.params.id, user)

        const isDeleted = await commentsService.deleteComment(new ObjectId(req.params.id));
        if (isDeleted) {
            return res.sendStatus(204)
        }
        return res.sendStatus(403)

})