import {User, userViewModel} from "../models/user-view-model";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add"
import {UsersRepository} from "../repositories/mongodb/users-repository-mongodb";
import {UsersService} from "./users-service";
import {emailManager} from "../managers/email-manager";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersService) protected usersService: UsersService) {
    }

    async registerUser(login: string, password: string, email: string): Promise<userViewModel | boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.usersService._generateHash(password, passwordSalt)

        const newUser = new User({login, email, passwordHash, passwordSalt, createdAt: new Date()},
            {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false},
            {recoveryCode: uuidv4(), expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                })
            })
        const createResult = this.usersRepository.createUser(newUser)

        try {
            await emailManager.sendRegistrationEmail(newUser.accountData.email, newUser.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error('error in send email:', error)
        }
        return createResult
    }

    async confirmEmail(code: string): Promise<boolean> {
        const foundUserByCode = await this.usersRepository.findByConfirmationCode(code);

        if (!foundUserByCode) return false

        if (foundUserByCode.emailConfirmation.isConfirmed) {
            return false
        } else {
            if (foundUserByCode.emailConfirmation.confirmationCode === code
                && foundUserByCode.emailConfirmation.expirationDate > new Date()) {
                return await this.usersRepository.updateConfirmation(foundUserByCode._id)

            } else return false
        }
    }

    async resendEmail(email: string): Promise<boolean> {
        const foundUser = await this.usersRepository.findByLoginOrEmail(email)

        if (foundUser) {
            let userWithUpdatedCode = await this.usersRepository.updateConfirmationCode(foundUser._id)

                if (userWithUpdatedCode) {
                    await emailManager.resendEmail(email, userWithUpdatedCode.emailConfirmation.confirmationCode)
                    return true
                } return false
        }
        return true
    }

    async sendPasswordRecoveryEmail(email: string): Promise<boolean> {
        const user = await this.usersRepository.findByLoginOrEmail(email)

        if (user) {
            let userWithUpdatedCode = await this.usersRepository.updatePasswordRecoveryCode(user._id)
                try {
                    await emailManager.sendPasswordRecoveryEmail(
                        email, userWithUpdatedCode!.passwordConfirmation.recoveryCode)
                    return true
                } catch (error) {
                    console.error('mail error')
                    return false
                }
            } else return true
    }

    async confirmRecoveryCode (recoveryCode: string): Promise<string | false> {
        const userByCode = await this.usersRepository.findByRecoveryCode(recoveryCode);

        if (!userByCode) return false

        if (userByCode.passwordConfirmation.recoveryCode === recoveryCode
                && userByCode.passwordConfirmation.expirationDate > new Date()) {
                return userByCode._id.toString()
        } else return false
    }

    async updatePassword(userId: string, newPassword: string): Promise<boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.usersService._generateHash(newPassword, passwordSalt)
        return await this.usersRepository.updatePassword(new ObjectId(userId), passwordHash, passwordSalt)
    }
}