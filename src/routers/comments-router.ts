import {Request, Response, Router} from "express";
import {authBearerMiddleware} from "../middlewares/auth-bearer";
import {getPagination} from "../functions/pagination";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {commentsService} from "../domain/comments-service";


export const commentsRouter = Router({})

commentsRouter.get("/", async (req: Request, res: Response) => {
    const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
    const allComments = await commentsQueryRepository.findComments(page, limit, sortDirection, sortBy, skip)
    res.status(200).json(allComments)
})
// todo поиск по postID

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    let comment = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id));
    if (comment) {
        res.json(comment);
    } else res.sendStatus(404)
})
commentsRouter.post('/',
    authBearerMiddleware,
    async (req, res) => {
    const newComment = await commentsService.createComment(req.body.comment, req.user!.id)
        res.status(201).send(newComment)
    })