import {userModelWithMongoId, userViewModelWithId} from "../../models/userViewModel";
import {ObjectId} from "mongodb";
import {usersCollection} from "../db";

export const usersRepository = {

    async createUser (newUser : userModelWithMongoId): Promise<userViewModelWithId> {

        const result = await usersCollection.insertOne(newUser)
        return {
            id: newUser._id.toString(),
            userName: newUser.userName,
            email: newUser.email,
            passwordHash: newUser.passwordHash,
            passwordSalt: newUser.passwordSalt,
            createdAt: newUser.createdAt
        }
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<userViewModelWithId | null> {
        const user: userModelWithMongoId | null = await usersCollection.findOne({loginOrEmail});
        if (!user) {
            return null
        }
        return {
            id: user._id.toString(),
            userName: user.userName,
            email: user.email,
            passwordHash: user.passwordHash,
            passwordSalt: user.passwordSalt,
            createdAt: user.createdAt
        }
    },

    async deleteUser(_id: ObjectId) {
        const user = await usersCollection.findOne({_id}, {projection: {_id: 0}});
        if (user) {
            return await usersCollection.deleteOne(user);
        }
        return null
    },


}