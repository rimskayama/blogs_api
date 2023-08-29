import {userInputModel, userViewModel} from "../models/user-view-model";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add"
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
import {usersService} from "./users-service";
import {emailManager} from "../managers/email-manager";
import {authRepository} from "../repositories/mongodb/auth-repository-mongodb";

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
            }
        }
        const createResult = usersRepository.createUser(newUser)

        try {
            await emailManager.sendEmail(newUser.accountData.email, newUser.emailConfirmation.confirmationCode)
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
            if (!foundUser.emailConfirmation.isConfirmed) {

                let userWithUpdatedCode = await usersRepository.updateConfirmationCode(foundUser._id)

                if (userWithUpdatedCode) {
                    const result = await emailManager.resendEmail(email, userWithUpdatedCode.emailConfirmation.confirmationCode)
                    return true
                } return false
            } return false
        }
        return false
    },

    async checkIfTokenIsValid(token: string): Promise<boolean> {
        let result = await authRepository.checkIfTokenIsValid(token)
        return result
    },

}