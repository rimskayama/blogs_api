import {DevicesService} from "../domain/devices-service";
import {DevicesQueryRepository} from "../repositories/query-repos/devices-query-repository";
import {Request, Response} from "express";

export class DevicesController {
    constructor(
        protected devicesService: DevicesService,
        protected devicesQueryRepository: DevicesQueryRepository) {
    }
    async getDevices (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) {
            res.sendStatus(401)
        }
        const session = await this.devicesService.getSession(refreshToken)
        if (session) {
            const allDevices = await this.devicesQueryRepository.findDevices(session.userId)
            res.status(200).json(allDevices)
        } else res.sendStatus(401)
    }

    async deleteSession (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) {
            return res.sendStatus(401)
        }
        const session = await this.devicesService.getSession(refreshToken)

        if (session) {
            await this.devicesService.terminateAllSessions(session.userId, session.deviceId)
            res.sendStatus(204)
        }  else res.sendStatus(401)
    }
    async deleteAllOthersSessions(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) {
            return res.sendStatus(401)
        }

        const deviceIdFromReq = req.params.deviceId
        if(!deviceIdFromReq) {
            return res.sendStatus(404)
        }
        const sessionFromReq = await this.devicesService.getSessionByDeviceId(deviceIdFromReq)
        const session = await this.devicesService.getSession(refreshToken)
        if (!session) {
            return res.sendStatus(401)
        }
        if (!sessionFromReq) {
            return res.sendStatus(404)
        }

        if (sessionFromReq.userId.toString() !== session.userId.toString()) {
            res.sendStatus(403);
        } else {
            const isDeleted = await this.devicesService.terminateSession(sessionFromReq.deviceId)
            if (isDeleted) {
                return res.sendStatus(204)
            }
        }
    }
}