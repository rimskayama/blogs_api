import {NextFunction, Request, Response} from "express";
import {container} from "../composition-root";
import {APIsRepository} from "../repositories/mongodb/apis-repository";

const apisRepository = container.resolve(APIsRepository)

export const rateLimitMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {

    const URL = req.originalUrl;
    const ip = req.socket.remoteAddress!;
    const date = new Date();

    await apisRepository.addNewAPICall(URL, ip, date)

    const result = await apisRepository.countAPICalls(URL, ip)

    if (result > 5) {
        return res.sendStatus(429)
    } next()
}