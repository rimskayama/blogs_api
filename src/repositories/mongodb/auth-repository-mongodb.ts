import {tokensCollection} from "../db";

export const authRepository = {

    async checkIfTokenIsValid(token: string): Promise<boolean> {
        let result = await tokensCollection.findOne({token})
        if (result) {
            return false
        } else return true
    },

}