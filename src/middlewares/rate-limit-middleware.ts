import {NextFunction, Request, Response} from "express";
import {subtractSeconds} from "../functions/functions-authentication";
import {APIsCollection} from "../repositories/db";
import {ObjectId} from "mongodb";

export const rateLimitMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {

    const URL = req.baseUrl;
    const ip = req.socket.remoteAddress!;
    const newAPICall = {
        id: new ObjectId(),
        ip: ip,
        URL: URL,
        date: new Date(Date.now())
    }
    const date = subtractSeconds(newAPICall.date, 10)
    await APIsCollection.insertOne(newAPICall)

    const result = await APIsCollection.countDocuments(
        {
            ip: {$regex: ip, $options: 'i'},
            URL: {$regex: URL, $options: 'i'},
            date: {$gte: date}}
    )
    if (result >= 5) {
        return res.sendStatus(429)
    }
    return next()













}