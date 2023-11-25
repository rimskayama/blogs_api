import {User, userViewModel} from "../../models/user-view-model";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UserModel} from "../../schemas/user-schema";

export class UsersRepository {

    async createUser (newUser : User): Promise<userViewModel> {

        await UserModel.insertMany([newUser])
        return User.getViewUser(newUser)
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {

        const user: User | null = await UserModel.findOne(
            {$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]});

        if (!user) {
            return null
        }
        return user

    }

    async findByConfirmationCode(code: string): Promise<User | null> {
        const user: User | null = await UserModel.findOne(
            {"emailConfirmation.confirmationCode": code})
        return user || null
    }

    async findByRecoveryCode(recoveryCode: string): Promise<User | null> {
        const user: User | null = await UserModel.findOne(
            {"passwordConfirmation.recoveryCode": recoveryCode})
        return user || null
    }

    async updateConfirmation(_id: ObjectId) {
        await UserModel.updateOne({_id}, {
            $set:
                {
                    "emailConfirmation.isConfirmed": true
                }
        })
        return true
    }

    async updateConfirmationCode(_id: ObjectId) {
        await UserModel.updateOne({_id}, {
            $set:
                {
                    "emailConfirmation.confirmationCode": uuidv4(),
                    "emailConfirmation.expirationDate": add(new Date(),{
                        hours: 1,
                        minutes: 3
                    })
                }
        })
        return UserModel.findOne({_id});
    }

    async updatePasswordRecoveryCode(_id: ObjectId) {
        await UserModel.updateOne({_id}, {
            $set:
                {
                    "passwordConfirmation.recoveryCode": uuidv4(),
                    "passwordConfirmation.expirationDate": add(new Date(),{
                        hours: 1,
                        minutes: 3
                    })
                }
        })
        return UserModel.findOne({_id});
    }

    async updatePassword(_id: ObjectId, passwordHash: string, passwordSalt: string) {
        await UserModel.updateOne({_id}, {
            $set:
                {
                    "accountData.passwordHash": passwordHash,
                    "accountData.passwordSalt": passwordSalt
                }
        })
        return true
    }

    async deleteUser(_id: ObjectId) {
        const user = await UserModel.findOne({_id}, {projection: {_id: 0}});
        if (user) {
            return UserModel.deleteOne({_id});
        }
        return null
    }

    async deleteAll() {
        return UserModel.deleteMany({}, {});
    }

}