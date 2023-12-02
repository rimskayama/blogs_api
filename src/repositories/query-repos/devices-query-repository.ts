import {deviceViewModel} from "../../models/device-model";
import {devicesMapping} from "../../functions/mapping";
import {DeviceModel} from "../../schemas/device-schema";
import {injectable} from "inversify";

@injectable()
export class DevicesQueryRepository {
    async findDevices(userId: string): Promise<deviceViewModel[]> {
        let allDevices = await DeviceModel.find(
            {userId: userId},{})
            .lean()

        return devicesMapping(allDevices)
    }

}

