import {Request, Response, Router} from "express";
import {authBearerMiddleware} from "../middlewares/auth-bearer";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {commentsService} from "../domain/comments-service";
import {commentContentValidationMiddleware} from "../middlewares/comments-validation-input";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {jwtService} from "../application/jwt-service";


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
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]

            const checkUser = await jwtService.getUserIdByToken(token)

            if (checkUser === new ObjectId(req.params.id)) {
                const isUpdated = await commentsService.updateComment(
                    new ObjectId(req.params.id), req.body.content)
                if (isUpdated) {
                    res.sendStatus(204);
                } else {
                    res.status(404).send('Not found');
                }
            } else res.sendStatus(403)
        }
    })

// delete
commentsRouter.delete("/:id",
    authBearerMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await commentsService.deleteComment(new ObjectId(req.params.id));
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    })