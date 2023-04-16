import {userInputModel} from "../models/user-view-model";
import jwt from "jsonwebtoken"
import {settings} from "../settings";
import {ObjectId} from "mongodb";

export const jwtService  = {
    async createJWT(user: userInputModel) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '1h'})
        return {
            "accessToken": token
            }
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            //console.log(result)
            return result.userId
        } catch (error) {
            return null
        }
    }
}
