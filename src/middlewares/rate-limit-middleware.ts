import {NextFunction, Request, Response} from "express";
import {subtractSeconds} from "../functions/functions-authentication";
import {APIsCollection} from "../repositories/db";
import {ObjectId} from "mongodb";

export const rateLimitMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {

    let URL = req.baseUrl;
    let ip = req.socket.remoteAddress!;
    let date = subtractSeconds(new Date, 10)//new Date()

    const newAPICall = {
        id: new ObjectId(),
        ip: ip,
        URL: URL,
        date: new Date()
    }
    await APIsCollection.insertOne(newAPICall)

    const result = await APIsCollection.countDocuments(
        {
            ip: {$regex: ip, $options: 'i'},
            URL: {$regex: URL, $options: 'i'},
            date: {$gte: date}}
    )

    if (result >= 5) {
        res.sendStatus(429)
    } else next()













}