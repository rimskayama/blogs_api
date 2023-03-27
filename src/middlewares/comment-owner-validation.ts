/*import {NextFunction, Response, Request} from "express";
import {jwtService} from "../application/jwt-service";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";

export const commentOwnerValidation = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization!.split(' ')[1]; token from req

    const getUserIdByToken = await jwtService.getUserIdByToken(token);  userId from req

    const foundComment = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id));
    const userId = foundComment?.commentatorInfo.userId;

    if (foundComment && getUserIdByToken!.toString() === userId) {
        next()
    }  else return false
*/