import {userInputModel, userViewModel} from "../models/user-view-model";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
import {ObjectId} from "mongodb";
import add from "date-fns/add";
export const usersService = {

    async createUser(login: string, email: string, password: string): Promise<userViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

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
                expirationDate: new Date(),
                isConfirmed: true
            },
            passwordConfirmation: {
                passwordRecoveryCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 0,
                    minutes: 3
                }),
            }}

        return usersRepository.createUser(newUser)
    },

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false // login or password
        if (user) {
            const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
            if (user.accountData.passwordHash !== passwordHash) {
                return false // password
            } else return user
        } return false
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async deleteUser(_id: ObjectId) {
        return await usersRepository.deleteUser(_id);
    },

    async deleteAll() {
        return await usersRepository.deleteAll();
    }
}