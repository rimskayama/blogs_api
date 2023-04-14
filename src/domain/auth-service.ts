import {userInputModel, userViewModel} from "../models/user-view-model";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
import {usersService} from "./users-service";
import {emailManager} from "../managers/email-manager";

export const authService = {

        async registerUser(login: string, password: string, email: string): Promise<userViewModel> {
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await usersService._generateHash(password, passwordSalt)

            const newUser: userInputModel = {
                _id: new ObjectId(),
                login: login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode: uuidv4(),
                    expirationDate: new Date(),
                    isConfirmed: false
                }}
            let info = await emailManager.sendEmail(newUser.email)
            console.log(info)

            return usersRepository.createUser(newUser)

        },

        async confirmEmail(code: string): Promise<boolean> {
            const foundUserByCode = await usersRepository.findByConfirmationCode(code);

            if (!foundUserByCode) return false
            if (foundUserByCode.emailConfirmation.confirmationCode === code
                && foundUserByCode.emailConfirmation.expirationDate > new Date()) {
                let result = await usersRepository.updateConfirmation(foundUserByCode._id)
                return result
            } else return false
        },

        async resendEmail(email: string): Promise<boolean> {
            const foundUserConfirmation = (await usersRepository.findByLoginOrEmail(email))?.emailConfirmation.isConfirmed
            if (foundUserConfirmation) return false
            if (!foundUserConfirmation) {
                const result = await emailManager.sendEmail(email)
                return true
            }
            return false
        }
}