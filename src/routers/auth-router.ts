import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {authService} from "../domain/auth-service";
import {
    checkCodeInDb,
    checkEmailInDb,
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/authentication";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";

export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            res.sendStatus(401)
        } else

            if (user.emailConfirmation.isConfirmed) {
                const userId = user._id
                const token = await jwtService.createJWT(new ObjectId(userId))
                const refreshToken = await jwtService.createRefreshToken(new ObjectId(userId))
                res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                res.status(200).json(token)
            } else {
                res.sendStatus(400)
            }
});
authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            const checkIfTokenIsValid = await authService.checkIfTokenIsValid(refreshToken)
            if (checkIfTokenIsValid) {
                const userIdByToken = await jwtService.getUserIdByToken(refreshToken)
                if (userIdByToken) {
                    const token = await jwtService.createJWT(userIdByToken)
                    const refreshToken = await jwtService.createRefreshToken(userIdByToken)
                    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                    res.status(200).json(token)
                } else {
                    res.sendStatus(401)
                }
            } else res.sendStatus(401)
        } else res.sendStatus(401)
    });
authRouter.post('/logout',
    async (req: Request, res: Response) =>  {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            res.clearCookie("refreshToken").sendStatus(204)
        } else {
            res.sendStatus(401)
        }
});

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
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const newUser = await authService.registerUser(req.body.login, req.body.password, req.body.email)
        if (newUser) {
            res.status(204).json(newUser)
        } else
            res.status(400).json('mail error')
});

authRouter.post('/registration-confirmation',
    checkCodeInDb,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const result = await authService.confirmEmail(req.body.code)

        if (result) {
            res.sendStatus(204)
        } else
            res.status(400).json(
                { errorsMessages: [
                    { message: "Incorrect code or it was already used", field: "code" }] })
});

authRouter.post('/registration-email-resending',
    checkEmailInDb,
    errorsValidationMiddleware,
     async (req: Request, res: Response) => {
         const result = await authService.resendEmail(req.body.email)
         if (result) {
             res.sendStatus(204)
         } else {
             res.status(400).json(
                 { errorsMessages: [
                     { message: "Your email was already confirmed", field: "email" }] })
         }
});