import {ObjectId} from "mongodb";

export type blogViewModel =
    {
        name: string;
        description: string;
        websiteUrl: string;
        createdAt?: string;
        isMembership?: boolean;
}

export type withMongoId = {
    _id: ObjectId
}

export type withViewId = {
    id: string
}
export type blogModelWithMongoId = blogViewModel & withMongoId;
export type blogViewModelWithId = blogViewModel & withViewId;
