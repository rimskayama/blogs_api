import {deviceViewModel} from "../../models/device-model";
import {devicesMapping} from "../../functions/mapping";
import {DeviceModel} from "../../schemas/device-schema";

export const devicesQueryRepository = {

    async findDevices(userId: string): Promise<deviceViewModel[]> {
        let allDevices = await DeviceModel.find(
            {userId: userId},{})
            .lean()

        return devicesMapping(allDevices)
    },

}

