import {NextFunction, Request, Response} from "express";
import {APIsRepository} from "../repositories/mongodb/apis-repository-mongodb";
import {subtractSeconds} from "../functions/functions-authentication";

export const rateLimitMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {

    let URL = req.baseUrl;
    let IP = req.socket.remoteAddress!;
    let date = subtractSeconds(new Date, 10)

    let result = await APIsRepository.findAPICalls(URL, IP, date)
    if (result) {
        next()
    } else res.sendStatus(429)













}