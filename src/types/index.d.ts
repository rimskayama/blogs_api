import {userViewModelWithId} from "../models/user-view-model";

declare global {
    namespace Express {
        export interface Request {
            user: userViewModelWithId | null
        }
    }
}