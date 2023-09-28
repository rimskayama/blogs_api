import {devicesCollection} from "../db";
import {deviceInputModel} from "../../models/device-model";

export const devicesRepository = {

    async createNewSession(refreshTokenMeta: deviceInputModel) {
        return await devicesCollection.insertOne(refreshTokenMeta)
    },

    async getSession(deviceId: string, lastActiveDate: string) {
        let session = await devicesCollection.findOne({
            $and: [{deviceId: deviceId}, {lastActiveDate: lastActiveDate}]})
        if (session) {
            return session
        } return false
    },

    async getSessionByDeviceId(deviceId: string) {
        let session = await devicesCollection.findOne({deviceId: deviceId})
        if (session) {
            return session
        } return false
    },

    async updateLastActiveDate(deviceId: string, lastActiveDate: string) {
        return await devicesCollection.updateOne({deviceId: deviceId}, {
            $set:
                {
                    lastActiveDate: lastActiveDate
                }
        })
    },

    async terminateAllSessions(userId: string, deviceId: string) {
        return await devicesCollection.deleteMany(
            {
                $and: [{userId}, {deviceId: {$ne: deviceId}}]
            })
    },


    async terminateSession(deviceId: string) {
        await devicesCollection.deleteOne({deviceId: deviceId})
        const session = await devicesCollection.findOne({deviceId: deviceId})
        if (!session) {
            return true
        }
        return false
    }

}