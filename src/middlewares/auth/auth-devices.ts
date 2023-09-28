import {NextFunction, Request, Response} from "express";
import {devicesService} from "../../domain/devices-service";

export const authDevicesMiddleware = async (req: Request, res: Response, next: NextFunction
) => {

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken) {
        return res.sendStatus(401)
    }

    let session = await devicesService.getSession(refreshToken)

    if (session) {
        next()
    } else {
        res.sendStatus(401)
    }

}