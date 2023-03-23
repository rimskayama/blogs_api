import {blogViewModelWithId} from "./blogViewModel";
import {postViewModelWithId} from "./postViewModel";

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
