import {ObjectId} from "mongodb";

export class Blog {
    _id: ObjectId;
    isMembership: boolean;
    createdAt?: string
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string

    ) {
       this._id = new ObjectId();
       this.isMembership = false;
       this.createdAt = new Date().toISOString()
    }

    static getViewBlog(blogFromDb: Blog): blogViewModel {
        return {
            id: blogFromDb._id.toString(),
            name: blogFromDb.name,
            description: blogFromDb.description,
            websiteUrl: blogFromDb.websiteUrl,
            isMembership: blogFromDb.isMembership,
            createdAt: blogFromDb.createdAt,
        }
    }
}

export type blogViewModel = {
        id: string
        name: string,
        description: string,
        websiteUrl: string,
        isMembership: boolean | false,
        createdAt?: string
}
