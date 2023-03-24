import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/usersValidationMiddleware";
import {basicAuthMiddleware} from "../middlewares/basicAuth";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";

export const authRouter = Router({})

authRouter.post('/auth/login',
    basicAuthMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware,
    emailValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (checkResult) {
            res.status(204)
        } else res.status(401)
})