import {deviceViewModel} from "../../models/device-model";
import {devicesCollection} from "../db";
import {devicesMapping} from "../../functions/mapping";

export const devicesQueryRepository = {

    async findDevices(userId: string): Promise<deviceViewModel[]> {
        let allDevices = await devicesCollection.find(
            {userId: userId},{})
            .toArray()

        return devicesMapping(allDevices)
    },

}

