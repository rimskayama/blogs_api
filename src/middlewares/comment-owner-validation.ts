import {NextFunction, Response, Request} from "express";
import {jwtService} from "../application/jwt-service";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";

export const commentOwnerValidation = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization!.split(' ')[1]

    const getUserIdByToken = await jwtService.getUserIdByToken(token);

    const getUserIdFromComment = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id));
    const userId = getUserIdFromComment?.commentatorInfo.userId;

    if (getUserIdByToken && userId && getUserIdByToken!.toString() === userId) {
        next()
    }  else res.sendStatus(403)

}