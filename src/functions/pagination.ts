import {Sort} from "mongodb";

export const getPagination = (query: any) => {
        let page: number = Number(query.pageNumber) || 1;
        let limit: number = Number(query.pageSize) || 10;
        let sortDirection : Sort = query.sortDirection === 'asc' ? 1 : -1;
        let sortBy = query.sortBy || 'createdAt';
        let searchNameTerm = query.searchNameTerm || '';

        const skip: number = (page - 1) * limit;

        return {page, limit, sortDirection, sortBy, searchNameTerm, skip}
    }