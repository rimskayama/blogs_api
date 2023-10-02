import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
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
import {rateLimitMiddleware} from "../middlewares/rate-limit-middleware";
import {devicesService} from "../domain/devices-service";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {v4 as uuidv4} from "uuid";

export const authRouter = Router({})

authRouter.post('/login',
    rateLimitMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const user = await usersService.checkCredentials (req.body.loginOrEmail, req.body.password)
        if (!user) {
            return res.sendStatus(401)
        }

        if (user.emailConfirmation.isConfirmed) {
                const userId = user._id
                const deviceName = req.headers["user-agent"] || "Device name"
                const ip = req.socket.remoteAddress || "IP address"
                const expDate = req.headers.expires || "expDate"
                const deviceId = uuidv4()

                const token = await jwtService.createJWT(userId)
                const refreshToken = await jwtService.createRefreshToken(userId, deviceId)
                const lastActiveDate = new Date().toISOString()

                await devicesService.createNewSession(refreshToken, deviceName, ip, userId.toString(), expDate, lastActiveDate)

                return res.status(200)
                    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                    .json(token)
            }
        return res.sendStatus(400)
});
authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken

        if(!refreshToken) {
            return res.sendStatus(401)
        }
        const session = await devicesService.getSession(refreshToken)

        if (!session) {
            return res.sendStatus(401)
        }

        const newToken = await jwtService.createJWT(new ObjectId(session.userId))
        const newRefreshToken = await jwtService.createRefreshToken(new ObjectId(session.userId), session.deviceId)

        const lastActiveDate = new Date().toISOString()

        await devicesService.updateLastActiveDate(session.deviceId, lastActiveDate)
        return res.status(200)
            .cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true})
            .json(newToken)

    });
authRouter.post('/logout',
    async (req: Request, res: Response) =>  {

        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) {
            return res.sendStatus(401)
        }
        const session = await devicesService.getSession(refreshToken)

        if (!session) {
            return res.sendStatus(401)
        }
        await devicesService.terminateSession(session.deviceId)
        return res.clearCookie("refreshToken").sendStatus(204)

});

authRouter.get('/me',
    async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken

        if(!refreshToken) {
            return res.sendStatus(401)
        }
    const session = await devicesService.getSession(refreshToken)

        if (!session) {
            return res.sendStatus(401)
        }

        const meUser = await usersQueryRepository.findUserById(new ObjectId(session.userId))
        if (meUser) {
            return res.status(200).json({
                userId: meUser.id,
                login: meUser.login,
                email: meUser.email
            })
        }
});

// registration
authRouter.post('/registration',
    rateLimitMiddleware,
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
    rateLimitMiddleware,
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
    rateLimitMiddleware,
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