import {ObjectId} from "mongodb";

export type tokenModel = {
    id: ObjectId;
    token: string
}