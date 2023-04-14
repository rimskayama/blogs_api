import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
import {authService} from "../domain/auth-service";
import {
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/users-validation-input";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";

export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send(token)
        } else {
            res.sendStatus(401)
        }
})

authRouter.get('/me',
    authBearerMiddleware,
    async (req: Request, res: Response) => {
        let meUser = await usersQueryRepository.findUserById(new ObjectId(req.user!.id))
        res.status(200).json({
            userId: meUser?.id,
            login: meUser?.login,
            email: meUser?.email
        })
    });

// registration
authRouter.post('/registration',
    loginValidationMiddleware,
    emailValidationMiddleware,
    passwordValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
    const checkUser = await usersRepository.findByLoginOrEmail(req.body.email)
        if (checkUser) {
            res.sendStatus(400)
        } else {
            const newUser = await authService.registerUser(req.body.login, req.body.password, req.body.email)
            res.status(204).send(newUser)
        }
});

authRouter.post('/registration-confirmation',
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        } else
            res.sendStatus(400)
});

authRouter.post('/registration-email-resending',
    emailValidationMiddleware,
    errorsValidationMiddleware,
     async (req: Request, res: Response) => {
         const result = await authService.resendEmail(req.body.email)
         if (result) {
             res.sendStatus(204)
         } else
             res.sendStatus(400)
});