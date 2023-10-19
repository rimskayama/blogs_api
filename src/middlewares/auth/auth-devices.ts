import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt-service";

export const authDevicesMiddleware = async (req: Request, res: Response, next: NextFunction
) => {

    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByAccessToken(token)

    if (userId) {
        next()
    } else {
        res.sendStatus(401)
    }

}