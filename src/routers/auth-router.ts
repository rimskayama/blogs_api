import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {authService} from "../domain/auth-service";
import {
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/users-validation-input";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {emailCheck} from "../functions/check-if-email-exists";

export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) res.sendStatus(401)

        if (user) {
            if (user.emailConfirmation.isConfirmed) {
                res.sendStatus(400)
            } else {
                const token = await jwtService.createJWT(user)
                res.status(200).send(token)
            }
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
    emailCheck,
    loginValidationMiddleware,
    emailValidationMiddleware,
    passwordValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newUser = await authService.registerUser(req.body.login, req.body.password, req.body.email)
        if (newUser) {
            res.status(204).send(newUser)
        } else
            res.status(400).send('mail error')
});

authRouter.post('/registration-confirmation',
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        } else
            res.status(400).json({ errorsMessages: [{ message: "Incorrect code or it was already used", field: "code" }] })
});

authRouter.post('/registration-email-resending',
    emailValidationMiddleware,
    errorsValidationMiddleware,
     async (req: Request, res: Response) => {
         const result = await authService.resendEmail(req.body.email)
         if (result) {
             res.sendStatus(204)
         } else {
             res.status(400).json({ errorsMessages: [{ message: "Your email was already confirmed", field: "email" }] })
         }
});