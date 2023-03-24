import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {loginOrEmailValidationMiddleware, passwordValidationMiddleware
} from "../middlewares/usersValidationMiddleware";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";

export const authRouter = Router({})

authRouter.post('/auth/login',
    loginOrEmailValidationMiddleware,
    passwordValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (checkResult) {
            res.status(204)
        } else res.status(401)
})