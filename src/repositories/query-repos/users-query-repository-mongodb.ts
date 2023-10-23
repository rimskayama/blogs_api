import {ObjectId, SortDirection} from "mongodb";
import {usersPaginationViewModel} from "../../models/pagination-view-models";
import {usersMapping} from "../../functions/mapping";
import {userInputModel, userViewModel} from "../../models/user-view-model";
import {UserModel} from "../../schemas/user-schema";

export const usersQueryRepository = {
    async findUsers(
        page: number, limit: number, sortDirection: SortDirection,
        sortBy: string, skip: number, searchLoginTerm: string, searchEmailTerm: string):
        Promise<usersPaginationViewModel>
    {

        let allUsers = await UserModel.find(
            {$or:
                    [{"accountData.login": {$regex: searchLoginTerm, $options: 'i'}},
                     {"accountData.email": {$regex: searchEmailTerm, $options: 'i'}}]}
        )

            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .skip(skip)
            .lean()

        const total = await UserModel.countDocuments(
            {$or:
                    [{"accountData.login": {$regex: searchLoginTerm, $options: 'i'}},
                        {"accountData.email": {$regex: searchEmailTerm, $options: 'i'}}]}
        )

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: usersMapping(allUsers)
        }
    },

    async findUserById (
        _id: ObjectId): Promise<userViewModel | null> {
        const user: userInputModel | null = await UserModel.findOne({_id});
        if (!user) {
            return null
        }
        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }

    },
}