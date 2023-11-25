import {Request, Response, Router} from "express"
import {JwtService} from "../application/jwt-service";
import {AuthService} from "../domain/auth-service";
import {
    checkCodeInDb,
    checkEmailInDb, checkIfEmailConfirmed, checkRecoveryCodeInDb,
    emailValidationMiddleware,
    loginValidationMiddleware, newPasswordValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/authentication";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {ObjectId} from "mongodb";
import {rateLimitMiddleware} from "../middlewares/rate-limit-middleware";
import {DevicesService} from "../domain/devices-service";
import {UsersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {UsersService} from "../domain/users-service";
import {v4 as uuidv4} from "uuid";

export const authRouter = Router({})

class AuthController {
    private usersService: UsersService;
    private authService: AuthService;
    private devicesService: DevicesService;
    private jwtService: JwtService;
    private usersQueryRepository: UsersQueryRepository;

    constructor() {
        this.usersService = new UsersService()
        this.authService = new AuthService()
        this.devicesService = new DevicesService()
        this.jwtService = new JwtService()
        this.usersQueryRepository = new UsersQueryRepository()
    }
    async loginUser (req: Request, res: Response) {
        const user = await this.usersService.checkCredentials (req.body.loginOrEmail, req.body.password)
        if (!user) {
            return res.sendStatus(401)
        }

        if (user.emailConfirmation.isConfirmed) {
            const userId = user._id
            const deviceName = req.headers["user-agent"] || "Device name"
            const ip = req.socket.remoteAddress || "IP address"
            const expDate = req.headers.expires || "expDate"
            const deviceId = uuidv4()

            const token = await this.jwtService.createJWT(userId)
            const refreshToken = await this.jwtService.createRefreshToken(userId, deviceId)

            await this.devicesService.createNewSession(
                refreshToken, deviceName, ip, userId.toString(), expDate)

            return res.status(200)
                .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                .json(token)
        }
        return res.sendStatus(400)
    }

    async getRefreshToken (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(401)
        }
        const session = await this.devicesService.getSession(refreshToken)
        if (!session) {
                return res.sendStatus(401)
            }
            const newToken = await this.jwtService.createJWT(new ObjectId(session.userId))
            const newRefreshToken = await this.jwtService.createRefreshToken(
                new ObjectId(session.userId), session.deviceId)
            const lastActiveDate = new Date().toISOString()

            await this.devicesService.updateLastActiveDate(session.deviceId, lastActiveDate)

            return res.status(200)
                .cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true})
                .json(newToken)

        }

    async logoutUser (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) {
            return res.sendStatus(401)
        }
        const session = await this.devicesService.getSession(refreshToken)
        if (!session) {
            return res.sendStatus(401)
        }
        await this.devicesService.terminateSession(session.deviceId)
        return res.clearCookie("refreshToken").sendStatus(204)
    }

    async getUserInfo (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(401)
        }
        const session = await this.devicesService.getSession(refreshToken)

        if (!session) {
            return res.sendStatus(401)
        }

        const meUser = await this.usersQueryRepository.findUserById(new ObjectId(session.userId))
        if (meUser) {
            return res.status(200).json({
                userId: meUser.id,
                login: meUser.login,
                email: meUser.email
            })
        }
    }
    async registerUser (req: Request, res: Response) {
        const newUser = await this.authService.registerUser(
            req.body.login, req.body.password, req.body.email)
        if (newUser) {
            res.status(204).json(newUser)
        } else
            res.status(400).json('mail error')
        }

    async confirmRegistration (req: Request, res: Response) {
        const result = await this.authService.confirmEmail(req.body.code)

        if (result) {
            return res.sendStatus(204)
        }   return res.sendStatus(400)
    }

    async resendEmail (req: Request, res: Response) {
        const result = await this.authService.resendEmail(req.body.email)
        if (result) {
            return res.sendStatus(204)
        }   return res.sendStatus(400).json('mail error')
    }

    async recoverPassword (req: Request, res: Response) {
        const result = await this.authService.sendPasswordRecoveryEmail(req.body.email)
        if (result) {
            return res.sendStatus(204)
        } return res.sendStatus(400)
    }
    async updatePassword (req: Request, res: Response) {
        const userIdByCode = await this.authService.confirmRecoveryCode(req.body.recoveryCode)
        if (userIdByCode) {
            await this.authService.updatePassword(userIdByCode, req.body.newPassword)
            return res.sendStatus(204)
        } return res.sendStatus(400)
    }
}

const authController = new AuthController()

authRouter.post('/login',
    rateLimitMiddleware,
    errorsValidationMiddleware,
    authController.loginUser.bind(authController));

authRouter.post('/refresh-token', authController.getRefreshToken.bind(authController));
authRouter.post('/logout', authController.logoutUser.bind(authController));
authRouter.get('/me', authController.getUserInfo.bind(authController));

authRouter.post('/registration',
    rateLimitMiddleware,
    emailValidationMiddleware,
    checkEmailInDb,
    loginValidationMiddleware,
    passwordValidationMiddleware,
    errorsValidationMiddleware,
    authController.registerUser.bind(authController));

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    checkCodeInDb,
    errorsValidationMiddleware,
    authController.confirmRegistration.bind(authController));

authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    emailValidationMiddleware,
    checkIfEmailConfirmed,
    errorsValidationMiddleware,
    authController.resendEmail.bind(authController));

authRouter.post('/password-recovery',
    rateLimitMiddleware,
    emailValidationMiddleware,
    errorsValidationMiddleware,
    authController.recoverPassword.bind(authController));

authRouter.post('/new-password',
    rateLimitMiddleware,
    newPasswordValidationMiddleware,
    checkRecoveryCodeInDb,
    errorsValidationMiddleware,
    authController.updatePassword.bind(authController));