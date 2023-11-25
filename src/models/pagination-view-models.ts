import {blogViewModel} from "./blog-view-model";
import {postViewModel} from "./post-view-model";
import {userViewModel} from "./user-view-model";
import {commentViewModel} from "./comments-view-model";

export type blogsPaginationViewModel =
    {
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: blogViewModel[]

    }

export type postsPaginationViewModel = {
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: postViewModel[]

}

export type usersPaginationViewModel = {
        pagesCount: number
        page: number;
        pageSize: number;
        totalCount: number;
        items: userViewModel[]
}

export type commentsPaginationViewModel = {
        pagesCount: number
        page: number;
        pageSize: number;
        totalCount: number;
        items: commentViewModel[]
}

