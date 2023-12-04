import {DevicesService} from "../domain/devices-service";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {UsersService} from "../domain/users-service";
import {AuthService} from "../domain/auth-service";
import {Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(AuthService) protected authService: AuthService,
        @inject(DevicesService) protected devicesService: DevicesService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {
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
        }
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