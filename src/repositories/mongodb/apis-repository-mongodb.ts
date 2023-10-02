import {APIsCollection} from "../db";
import {APIsModel} from "../../models/user-view-model";

export const APIsRepository = {

    async countNewAPICall(newAPICall: APIsModel) {
           return await APIsCollection.insertOne(newAPICall)
    },

    async findAPICalls(URL: string, ip: string, date: Date) : Promise<boolean> {
        const allAPICalls = await APIsCollection.countDocuments(
            {
                ip: {$regex: ip, $options: 'i'},
                URL: {$regex: URL, $options: 'i'},
                date: {$gte: date}}
        )
        if (allAPICalls >= 5) {
            return false
        } return true
    }
}