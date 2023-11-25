import {ObjectId} from "mongodb";

export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}

export class User {
    _id: ObjectId;
    constructor(
    public accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: Date;
    },
    public emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    },
    public passwordConfirmation: {
        recoveryCode: string,
        expirationDate: Date
    }
    )
    {
        this._id = new ObjectId();
    }
    static getViewUser(userFromDb: User) {
        return {
            id: userFromDb._id.toString(),
            login: userFromDb.accountData.login,
            email: userFromDb.accountData.email,
            createdAt: userFromDb.accountData.createdAt,
        }
    }
}

export type APIsModel = {
    ip: string,
    URL: string,
    date: Date
}
