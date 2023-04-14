import {ObjectId} from "mongodb";

export type userViewModel = {
    login: string,
    email: string,
    createdAt: Date
}

export type userInputModel = {
    _id: ObjectId,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
}}

export type withMongoId = {
    _id: ObjectId
}

export type withViewId = {
    id: string
}
export type userModelWithMongoId = userViewModel & withMongoId;
export type userViewModelWithId = userViewModel & withViewId;
