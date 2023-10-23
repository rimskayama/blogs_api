import {APIModel} from "../../schemas/api-schema";
export const APIsRepository = {
    async addNewAPICall(URL: string, ip: string, date: Date) {
        const newAPICall = {
            ip: ip,
            URL: URL,
            date: date
        }
        return await APIModel.insertMany([newAPICall])
    },

        async countAPICalls(URL: string, ip: string) : Promise<number> {
            const allAPICalls = await APIModel.countDocuments(
                {
                    URL: URL,
                    ip: ip,
                    date: {$gte: new Date( Date.now() - 10000)}
                }
            )
            return allAPICalls
    }}