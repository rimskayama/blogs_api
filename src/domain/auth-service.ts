import {userInputModel, userViewModel} from "../models/user-view-model";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add"
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
import {usersService} from "./users-service";
import {emailManager} from "../managers/email-manager";

export const authService = {

    async registerUser(login: string, password: string, email: string): Promise<userViewModel | boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await usersService._generateHash(password, passwordSalt)

        const newUser: userInputModel = {
            _id: new ObjectId(),
            accountData: {
                login: login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date(),
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            },
            passwordConfirmation: {
                recoveryCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
            }
        }
        const createResult = usersRepository.createUser(newUser)

        try {
            await emailManager.sendRegistrationEmail(newUser.accountData.email, newUser.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            await usersRepository.deleteUser(newUser._id)
            return false
        }
        return createResult
    },

    async confirmEmail(code: string): Promise<boolean> {
        const foundUserByCode = await usersRepository.findByConfirmationCode(code);

        if (!foundUserByCode) return false

        if (foundUserByCode.emailConfirmation.isConfirmed) {
            return false
        } else {
            if (foundUserByCode.emailConfirmation.confirmationCode === code
                && foundUserByCode.emailConfirmation.expirationDate > new Date()) {
                let result = await usersRepository.updateConfirmation(foundUserByCode._id)
                return result

            } else return false
        }
    },

    async resendEmail(email: string): Promise<boolean> {
        const foundUser = await usersRepository.findByLoginOrEmail(email)

        if (foundUser) {
            let userWithUpdatedCode = await usersRepository.updateConfirmationCode(foundUser._id)

                if (userWithUpdatedCode) {
                    const result = await emailManager.resendEmail(email, userWithUpdatedCode.emailConfirmation.confirmationCode)
                    return true
                } return false
        }
        return true
    },

    async sendPasswordRecoveryEmail(email: string): Promise<boolean> {
        const user = await usersRepository.findByLoginOrEmail(email)

        if (user) {
            let userWithUpdatedCode = await usersRepository.updatePasswordRecoveryCode(user._id)
                try {
                    await emailManager.sendPasswordRecoveryEmail(
                        email, userWithUpdatedCode!.passwordConfirmation.recoveryCode)
                    return true
                } catch (error) {
                    console.error('mail error')
                    return false
                }
            } else return true
    },

    async confirmRecoveryCode (recoveryCode: string): Promise<string | false> {
        const userByCode = await usersRepository.findByRecoveryCode(recoveryCode);

        if (!userByCode) return false

        if (userByCode.passwordConfirmation.recoveryCode === recoveryCode
                && userByCode.passwordConfirmation.expirationDate > new Date()) {
                return userByCode._id.toString()
        } else return false
    },

    async updatePassword(userId: string, newPassword: string): Promise<boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await usersService._generateHash(newPassword, passwordSalt)
        return await usersRepository.updatePassword(new ObjectId(userId), passwordHash, passwordSalt)
    },
}