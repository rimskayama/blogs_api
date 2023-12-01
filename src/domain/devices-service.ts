import {DevicesRepository} from "../repositories/mongodb/devices-repository-mongodb";
import {JwtService} from "../application/jwt-service";
import {Device} from "../models/device-model";

export class DevicesService {

    constructor(
        protected jwtService: JwtService,
        protected devicesRepository: DevicesRepository
    ) {
    }
    async createNewSession
    (refreshToken: string, deviceName: string, ip: string, userId: string, expDate: string) {

        const deviceId = await this.jwtService.getDeviceIdByRefreshToken(refreshToken)

        const device = new Device(deviceId, userId, ip, deviceName, expDate)
        return await this.devicesRepository.createNewSession(device)
    }

    async getSession(refreshToken: string) {

        const deviceId = await this.jwtService.getDeviceIdByRefreshToken(refreshToken)
        const lastActiveDate = await this.jwtService.getLastActiveDateByRefreshToken(refreshToken)

        return await this.devicesRepository.getSession(deviceId, lastActiveDate)

    }

    async getSessionByDeviceId(deviceId: string) {
        let session = await this.devicesRepository.getSessionByDeviceId(deviceId)

        if (session) {
            return session
        } else {
            return false
        }

    }

    async updateLastActiveDate(deviceId: string, lastActiveDate: string) {

        return await this.devicesRepository.updateLastActiveDate(deviceId, lastActiveDate)

    }

    async terminateAllSessions(userId: string, deviceId: string) {

        return await this.devicesRepository.terminateAllSessions(userId, deviceId)

    }

    async terminateSession(deviceId: string) {

        return await this.devicesRepository.terminateSession(deviceId)
    }

}