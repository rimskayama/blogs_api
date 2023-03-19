import {Sort} from "mongodb";

export const getPagination = (query: any) => {
        const page = query.pageNumber || 1;
        const limit = query.pageSize || 10;
        const sortDirection : Sort = query.sortDirection === 'asc' ? 1 : -1;
        const sortBy = query.sortBy || 'createdAt';
        const searchNameTerm = query.searchNameTerm || '';

        const skip: number = (page - 1) * limit;

        return {page, limit, sortDirection, sortBy, searchNameTerm, skip}
    }