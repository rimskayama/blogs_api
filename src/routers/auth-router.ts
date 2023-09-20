import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware, refreshTokenMiddleware} from "../middlewares/auth/auth-bearer";
import {authService} from "../domain/auth-service";
import {
    checkCodeInDb,
    checkEmailInDb,
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/authentication";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {ObjectId} from "mongodb";

export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            return res.sendStatus(401)
        }

        if (user.emailConfirmation.isConfirmed) {
                const userId = user._id
                const token = await jwtService.createJWT(userId)
                const refreshToken = await jwtService.createRefreshToken(userId)
                return res.status(200)
                    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                    .json(token)
            }
        return res.sendStatus(400)
});
authRouter.post('/refresh-token',
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
    const userId = req.user?.id
    const refreshToken = req.cookies.refreshToken
    await authService.deactivateToken(refreshToken)

            if (userId) {
                const token = await jwtService.createJWT(new ObjectId(userId))
                const refreshToken = await jwtService.createRefreshToken(new ObjectId(userId))
                return res.status(200)
                    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                    .json(token)
            } else res.sendStatus(401)
    });
authRouter.post('/logout',
    refreshTokenMiddleware,
    async (req: Request, res: Response) =>  {
        const refreshToken = req.cookies.refreshToken
        await authService.deactivateToken(refreshToken)
    res.clearCookie("refreshToken").sendStatus(204)
});

authRouter.get('/me',
    authBearerMiddleware,
    async (req: Request, res: Response) => {

        res.status(200).json({
            userId: req.user?.id,
            login: req.user?.login,
            email: req.user?.email
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