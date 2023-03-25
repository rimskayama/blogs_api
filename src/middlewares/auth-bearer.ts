import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction
) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersQueryRepository.findUserById(userId)
        next()
        return
    } res.sendStatus(401)
    //return
};