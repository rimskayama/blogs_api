import mongoose from 'mongoose'
import {APIsModel} from "../models/user-view-model";

export const APISchema = new mongoose.Schema<APIsModel>({
    ip: { type: String, require: true },
    URL: { type: String, require: true },
    date: { type: Date, require: true },
})
export const APIModel = mongoose.model<APIsModel>('APIs', APISchema)