import mongoose from 'mongoose'
import {User} from "../models/user-view-model";

export const UserSchema = new mongoose.Schema<User>({

    _id: { type: mongoose.Schema.Types.ObjectId, require: true },
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
            recoveryCode: { type: String},
            expirationDate: { type: Date}
        }
    }
})
export const UserModel = mongoose.model<User>('users', UserSchema)