import jwt from "jsonwebtoken"
import {settings} from "../settings";
import {ObjectId} from "mongodb";

export const jwtService  = {
    async createJWT(userId: ObjectId) {
        const token = jwt.sign({userId: userId}, settings.JWT_SECRET,
            {expiresIn: '10s'})
        return {
            "accessToken": token
            }
    },
    async createRefreshToken(userId: ObjectId, deviceId: string) {
        const refreshToken = jwt.sign(
            {userId: userId, deviceId: deviceId}, settings.refreshTokenSecret,
            {expiresIn: '20s'})
        return refreshToken
    },


    async getDeviceIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.refreshTokenSecret)
            return result.deviceId.toString()
        } catch (error) {
            return false
        }},

    async getLastActiveDateByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.refreshTokenSecret)
            return result.iat.toString()
        } catch (error) {
            return false
        }}

}
