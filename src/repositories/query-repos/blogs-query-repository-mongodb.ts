import {blogModelWithMongoId, blogViewModelWithId} from "../../models/blog-view-model";
import {ObjectId, SortDirection} from "mongodb";
import {blogsMapping} from "../../functions/mapping";
import {blogsPaginationViewModel} from "../../models/pagination-view-models";
import {BlogModel} from "../../schemas/blog-schema";


export const blogsQueryRepository = {
    async findBlogs(
        page: number, limit: number, sortDirection: SortDirection,
        sortBy: string, searchNameTerm: string, skip: number) : Promise<blogsPaginationViewModel>
    {

        let allBlogs = await BlogModel.find(
            {name: {$regex: searchNameTerm, $options: 'i'}},
            )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .lean()

        const total = await BlogModel.countDocuments(
            { name: { $regex: searchNameTerm, $options: 'i' }})

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: blogsMapping(allBlogs)
        }
    },

    async findBlogById(_id: ObjectId): Promise<blogViewModelWithId | null> {
        const blog: blogModelWithMongoId | null = await BlogModel.findOne({_id});
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },

    async findBlogByBlogId(blogId: string): Promise<blogViewModelWithId | null> {
        const blog: blogModelWithMongoId | null = await BlogModel.findOne({_id: new ObjectId(blogId)},{});
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },
}