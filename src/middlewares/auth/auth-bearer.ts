import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt-service";
import {usersQueryRepository} from "../../repositories/query-repos/users-query-repository-mongodb";
import {ObjectId} from "mongodb";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction
) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (!userId) {
        return res.sendStatus(401)
    }
    req.user = await usersQueryRepository.findUserById(new ObjectId(userId))
    if (!req.user) return res.sendStatus(401)
    next()

};