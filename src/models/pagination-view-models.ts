import {blogViewModelWithId} from "./blog-view-model";
import {postViewModelWithId} from "./post-view-model";
import {userViewModelWithId} from "./user-view-model";
import {commentViewModelWithId} from "./comments-view-model";

export type blogsPaginationViewModel =
    {
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: blogViewModelWithId[]

    }

export type postsPaginationViewModel = {
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: postViewModelWithId[]

}

export type usersPaginationViewModel = {
        pagesCount: number
        page: number;
        pageSize: number;
        totalCount: number;
        items: userViewModelWithId[]
}

export type commentsPaginationViewModel = {
        pagesCount: number
        page: number;
        pageSize: number;
        totalCount: number;
        items: commentViewModelWithId[]
}

