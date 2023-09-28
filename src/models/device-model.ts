export type deviceViewModel = {
    userId: string,
    IP: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
}

export type withExpDate = {
    expDate: string
}

export type deviceModelWithExpDate = deviceViewModel & withExpDate