import {ObjectId} from "mongodb";

export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}

export type userInputModel = {
    _id: ObjectId,
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: Date,
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    },
    passwordConfirmation: {
        passwordRecoveryCode: string,
        expirationDate: Date
    }
}

export type APIsModel = {
    ip: string,
    URL: string,
    date: Date
}
