import {ObjectId} from "mongodb";

export type userViewModel = {
    userName: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: Date
}

export type withMongoId = {
    _id: ObjectId
}

export type withViewId = {
    id: string
}
export type userModelWithMongoId = userViewModel & withMongoId;
export type userViewModelWithId = userViewModel & withViewId;
