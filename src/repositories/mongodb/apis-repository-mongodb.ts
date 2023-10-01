import {APIsCollection} from "../db";
import {APIsModel} from "../../models/user-view-model";

export const APIsRepository = {

    async countNewAPICall(newAPICall: APIsModel) {
           return await APIsCollection.insertOne(newAPICall)
    },

    async findAPICalls(URL: string, IP: string, date: Date) : Promise<boolean> {
        const allAPICalls = await APIsCollection.countDocuments(
            {
                IP: {$regex: IP, $options: 'i'},
                URL: {$regex: URL, $options: 'i'},
                date: {$gte: date}}
        )
        if (allAPICalls >= 4) {
            return false
        } return true
    }
}