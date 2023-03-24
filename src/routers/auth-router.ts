import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";

export const authRouter = Router({})

authRouter.post('/auth/login',
    async (req: Request, res: Response) => {
        const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (checkResult) {
            res.sendStatus(204)
        } else res.sendStatus(401)
})