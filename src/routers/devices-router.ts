import {Request, Response, Router} from "express"
import {devicesQueryRepository} from "../repositories/query-repos/devices-query-repository";
import {devicesService} from "../domain/devices-service";

export const devicesRouter = Router({})
devicesRouter.get('/',
    async (req: Request, res: Response) => {

            const refreshToken = req.cookies.refreshToken
            if(!refreshToken) {
                res.sendStatus(401)
            }
            const session = await devicesService.getSession(refreshToken)

            if (session) {
                const allDevices = await devicesQueryRepository.findDevices(session.userId)
                res.status(200).json(allDevices)
            } else res.sendStatus(401)

})

devicesRouter.delete('/',
    async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken

        if(!refreshToken) {
            return res.sendStatus(401)
        }

        const session = await devicesService.getSession(refreshToken)

        if (session) {
            await devicesService.terminateAllSessions(session.userId, session.deviceId)
            res.sendStatus(204)
        }   else res.sendStatus(401)


    })

devicesRouter.delete('/:deviceId',
    async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) {
        return res.sendStatus(401)
    }

    const deviceIdFromReq = req.params.deviceId
    if(!deviceIdFromReq) {
        return res.sendStatus(404)
    }
    const sessionFromReq = await devicesService.getSessionByDeviceId(deviceIdFromReq)
    const session = await devicesService.getSession(refreshToken)
        if (!session) {
            return res.sendStatus(401)
        }
        if (!sessionFromReq) {
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
