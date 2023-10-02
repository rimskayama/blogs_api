import {NextFunction, Request, Response} from "express";
import {APIsRepository} from "../repositories/mongodb/apis-repository";

export const rateLimitMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {

    const URL = req.baseUrl;
    const ip = req.socket.remoteAddress!;
    const date = new Date();

    await APIsRepository.addNewAPICall(URL, ip, date)

    const result = await APIsRepository.countAPICalls(URL, ip)

    if (result > 5) {
        return res.sendStatus(429)
    } else next()
}