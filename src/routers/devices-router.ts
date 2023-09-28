import {Request, Response, Router} from "express"
import {devicesQueryRepository} from "../repositories/query-repos/devices-query-repository";
import {authDevicesMiddleware} from "../middlewares/auth/auth-devices";
import {devicesService} from "../domain/devices-service";

export const devicesRouter = Router({})
devicesRouter.get('/',
    async (req: Request, res: Response) => {

            const refreshToken = req.cookies.refreshToken

            if(!refreshToken) {
                return res.sendStatus(401)
            }
            const session = await devicesService.getSession(refreshToken)

            if (session) {
                const allDevices = await devicesQueryRepository.findDevices(session.userId)
                return res.status(200).json(allDevices)
            }
            return res.sendStatus(401)

})

devicesRouter.delete('/',
    authDevicesMiddleware,
    async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken
        const session = await devicesService.getSession(refreshToken)

        if (session) {
            await devicesService.terminateAllSessions(session.userId, session.deviceId)
        }
        res.sendStatus(204)

    })

devicesRouter.delete('/:deviceId',
    authDevicesMiddleware,
    async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    const deviceIdFromReq = req.params.deviceId
    const sessionFromReq = await devicesService.getSessionByDeviceId(deviceIdFromReq)
    const session = await devicesService.getSession(refreshToken)

        if (!session || !sessionFromReq) {
            return res.sendStatus(404)
        }
        if (sessionFromReq.userId.toString() !== session.userId.toString()) {
            res.sendStatus(403);
        } else {
            const isDeleted = await devicesService.terminateSession(sessionFromReq.deviceId)
            if (isDeleted) {
                return res.sendStatus(204)
            }
        }

})
