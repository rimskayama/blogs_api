import {userInputModel, userViewModelWithId} from "../../models/userViewModel";
import {ObjectId} from "mongodb";
import {blogsCollection, usersCollection} from "../db";

export const usersRepository = {

    async createUser (newUser : userInputModel): Promise<userViewModelWithId> {

        const result = await usersCollection.insertOne(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<userInputModel| null> {
        const user: userInputModel | null = await usersCollection.findOne({loginOrEmail});
        if (!user) {
            return null
        }
        return user

    },

    async deleteUser(_id: ObjectId) {
        const user = await usersCollection.findOne({_id}, {projection: {_id: 0}});
        if (user) {
            return await usersCollection.deleteOne(user);
        }
        return null
    },

    async deleteAll() {
        return await usersCollection.deleteMany({},{});
    }

}