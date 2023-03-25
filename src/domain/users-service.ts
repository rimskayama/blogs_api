import {userInputModel, userViewModel} from "../models/user-view-model";
import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
import {ObjectId} from "mongodb";
export const usersService = {

    async createUser(login: string, email: string, password: string): Promise<userViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: userInputModel = {
            _id: new ObjectId(),
            login: login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date()
        }
        return usersRepository.createUser(newUser)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false // login or password
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false // password
        }
        return user
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        console.log('hash' + hash)
        return hash
    },

    async deleteUser(_id: ObjectId) {
        return await usersRepository.deleteUser(_id);
    },

    async deleteAll() {
        return await usersRepository.deleteAll();
    }
}