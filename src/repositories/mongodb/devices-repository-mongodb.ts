import {deviceInputModel} from "../../models/device-model";
import {DeviceModel} from "../../schemas/device-schema";

export const devicesRepository = {

    async createNewSession(refreshTokenMeta: deviceInputModel) {
        return await DeviceModel.insertMany([refreshTokenMeta])
    },

    async getSession(deviceId: string, lastActiveDate: string) {
        let session = await DeviceModel.findOne({deviceId: deviceId}, {lastActiveDate: lastActiveDate})
        if (session) {
            return session
        } return false
    },

    async getSessionByDeviceId(deviceId: string) {
        let session = await DeviceModel.findOne({deviceId: deviceId})
        if (session) {
            return session
        } return false
    },

    async updateLastActiveDate(deviceId: string, lastActiveDate: string) {
        return DeviceModel.updateOne({deviceId: deviceId}, {
            $set:
                {
                    lastActiveDate: lastActiveDate
                }
        });
    },

    async terminateAllSessions(userId: string, deviceId: string) {
        return DeviceModel.deleteMany(
            {
                $and: [{userId}, {deviceId: {$ne: deviceId}}]
            });
    },


    async terminateSession(deviceId: string) {
        await DeviceModel.deleteOne({deviceId: deviceId})
        const session = await DeviceModel.findOne({deviceId: deviceId})
        if (!session) {
            return true
        }
        return false
    }

}