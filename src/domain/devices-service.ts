import {devicesRepository} from "../repositories/mongodb/devices-repository-mongodb";
import {jwtService} from "../application/jwt-service";

export const devicesService  = {
    async createNewSession
    (refreshToken: string, deviceName: string, IP: string, userId: string, expDate: string) {

        const deviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        const lastActiveDate = await jwtService.getLastActiveDateByRefreshToken(refreshToken)

        const refreshTokenMeta = {
            userId: userId,
            IP: IP,
            title: deviceName,
            lastActiveDate: lastActiveDate,
            deviceId: deviceId,
            expDate: expDate
        }
        return await devicesRepository.createNewSession(refreshTokenMeta)
    },

    async getSession(refreshToken: string) {

        const deviceId = await jwtService.getDeviceIdByRefreshToken(refreshToken)
        const lastActiveDate = await jwtService.getLastActiveDateByRefreshToken(refreshToken)

        return await devicesRepository.getSession(deviceId, lastActiveDate)

    },

    async getSessionByDeviceId(deviceId: string) {
        let session = await devicesRepository.getSessionByDeviceId(deviceId)

        if (session) {
            return session
        } else {
            return false
        }

    },


    async updateLastActiveDate(deviceId: string, lastActiveDate: string) {

        return await devicesRepository.updateLastActiveDate(deviceId, lastActiveDate)

    },

    async terminateAllSessions(userId: string, deviceId: string) {

        return await devicesRepository.terminateAllSessions(userId, deviceId)

    },

    async terminateSession(deviceId: string) {

        return await devicesRepository.terminateSession(deviceId)
    }

}