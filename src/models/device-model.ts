export class Device {
    lastActiveDate: string;
    constructor(
        public deviceId: string,
        public userId: string,
        public ip: string,
        public title: string,
        public expDate: string
    )
    {
        this.lastActiveDate = new Date().toISOString()
    }
    static getViewDevice(deviceFromDb: Device): deviceViewModel {
        return {
            ip: deviceFromDb.ip,
            title: deviceFromDb.title,
            lastActiveDate: deviceFromDb.lastActiveDate,
            deviceId: deviceFromDb.deviceId
        }
    }
}

export type deviceViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
}