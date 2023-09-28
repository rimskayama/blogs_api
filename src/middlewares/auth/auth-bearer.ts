/*import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt-service";
import {usersQueryRepository} from "../../repositories/query-repos/users-query-repository-mongodb";
import {ObjectId} from "mongodb";
export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction
) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByAccessToken(token)
    if (!userId) {
        return res.sendStatus(401)
    }
    //checkIsTokenValid
    req.user = await usersQueryRepository.findUserById(new ObjectId(userId))
    if (req.user) {
       return next()
    } else {
    return res.sendStatus(401);
}

};

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction
) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.sendStatus(401);
    }

    const userId = await jwtService.getUserIdByRefreshToken(refreshToken);
    if (!userId) {
        return res.sendStatus(401)
    }
    const checkIfTokenIsValid = await jwtService.checkIfTokenIsValid(refreshToken)
    if (!checkIfTokenIsValid) {
        return res.sendStatus(401)
    }

    req.user = await usersQueryRepository.findUserById(new ObjectId(userId))
    if (req.user) {
        next()
    } else {
        res.sendStatus(401);
    }

} */
