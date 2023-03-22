import {blogViewModelWithId} from "./blogViewModel";

export type blogsPaginationViewModel =
    {
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: blogViewModelWithId[]

    }
