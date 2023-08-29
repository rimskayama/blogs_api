import {tokensCollection} from "../db";
import {tokenModel} from "../../models/token-model";

export const authRepository = {

    async checkIfTokenIsValid(token: string): Promise<boolean> {
        let result = await tokensCollection.findOne({token: token})
        if (result) {
            return false
        } else return true
    },

    async deactivateToken(token: tokenModel): Promise<boolean> {
        let result = await tokensCollection.insertOne(token)
        return true
    }
}