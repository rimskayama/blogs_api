import mongoose from 'mongoose'
import {userInputModel} from "../models/user-view-model";
import {ObjectId} from "mongodb";

export const UserSchema = new mongoose.Schema<userInputModel>({

    _id: { type: ObjectId, require: true },
    accountData: {
        type: {
            login: {type: String, require: true},
            email: {type: String, require: true},
            passwordHash: { type: String, require: true },
            passwordSalt: { type: String, require: true },
            createdAt: { type: Date, require: true }
        }
    },
    emailConfirmation: {
        type: {
        confirmationCode: { type: String, require: true},
        expirationDate: { type: Date, require: true },
        isConfirmed: { type: Boolean, require: true }
        }
    },
    passwordConfirmation: {
        type: {
        passwordRecoveryCode: { type: String},
        expirationDate: { type: Date}
        }
    }
})
export const UserModel = mongoose.model<userInputModel>('users', UserSchema)