import mongoose from 'mongoose'
import {Device} from "../models/device-model";

export const DeviceSchema = new mongoose.Schema<Device>({
    userId: { type: String, require: true },
    ip: { type: String, require: true },
    title: { type: String, require: true },
    lastActiveDate: { type: String, require: true },
    deviceId: { type: String, require: true },
    expDate: { type: String, require: true },
})
export const DeviceModel = mongoose.model<Device>('devices', DeviceSchema)