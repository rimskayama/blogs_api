import jwt from "jsonwebtoken"
import {settings} from "../settings";
import {ObjectId} from "mongodb";

export const jwtService  = {
    async createJWT(userId: ObjectId) {
        const token = jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: '10m'})
        return {
            "accessToken": token
            }
    },
    async createRefreshToken(userId: ObjectId) {
        const refreshToken = jwt.sign({userId: userId}, settings.refreshTokenSecret, {expiresIn: '20m'})
        return refreshToken
    },

    async getUserIdByAccessToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return false
        }},

    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.refreshTokenSecret)
            return new ObjectId(result.userId)
        } catch (error) {
            return false
        }}
    }
