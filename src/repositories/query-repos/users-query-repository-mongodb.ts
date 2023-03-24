import {ObjectId, SortDirection} from "mongodb";
import {usersPaginationViewModel} from "../../models/paginationViewModels";
import {usersCollection} from "../db";
import {usersMapping} from "../../functions/mapping";
import {userModelWithMongoId, userViewModelWithId} from "../../models/userViewModel";

export const usersQueryRepository = {
    async findUsers(
        page: number, limit: number, sortDirection: SortDirection,
        sortBy: string, skip: number, searchLoginTerm: string, searchEmailTerm: string) : Promise<usersPaginationViewModel>
    {

        let allUsers = await usersCollection.find(
            {$or:
                    [{login: {$regex: searchLoginTerm, $options: 'i'}},
                     {email: {$regex: searchEmailTerm, $options: 'i'}}]}
        )

            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .skip(skip)
            .toArray()

        const total = await usersCollection.countDocuments(
            {$or:
                    [{login: {$regex: searchLoginTerm, $options: 'i'}},
                        {email: {$regex: searchEmailTerm, $options: 'i'}}]}
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
        _id: ObjectId): Promise<userViewModelWithId | null> {
        const user: userModelWithMongoId | null = await usersCollection.findOne({_id});
        if (!user) {
            return null
        }
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }

    },
}