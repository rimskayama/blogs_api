import {User, userViewModel} from "../models/user-view-model";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import {ObjectId} from "mongodb";
import add from "date-fns/add";
import {UsersRepository} from "../repositories/mongodb/users-repository-mongodb";

export class UsersService {
     constructor(protected usersRepository: UsersRepository) {
    }

    async createUser(login: string, email: string, password: string): Promise<userViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = new User({login, email, passwordHash, passwordSalt, createdAt: new Date()},
            {confirmationCode: uuidv4(), expirationDate: new Date(), isConfirmed: true},
            {recoveryCode: uuidv4(), expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                })
            })

        return this.usersRepository.createUser(newUser)
    }

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false // login or password
        if (user) {
            const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
            if (user.accountData.passwordHash !== passwordHash) {
                return false // password
            } else return user
        } return false
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async deleteUser(_id: ObjectId) {
        return await this.usersRepository.deleteUser(_id);
    }

    async deleteAll() {
        return await this.usersRepository.deleteAll();
    }
}