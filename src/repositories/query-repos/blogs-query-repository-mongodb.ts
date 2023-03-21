import {blogModelWithMongoId, blogViewModelWithId} from "../../models/blogViewModel";
import {blogsCollection} from "../db";
import {ObjectId, SortDirection} from "mongodb";
import {blogsMapping} from "../../functions/mapping";


export const blogsQueryRepository = {
    async findBlogs(
        page: number, limit: number, sortDirection: SortDirection,
        sortBy: string, searchNameTerm: string, skip: number)
    {
        let blogs = await blogsCollection.find().toArray();

        let allBlogs = await blogsCollection.find(
            {name: {$regex: searchNameTerm, $options: 'i'}},
            )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .toArray()

        const total = await blogsCollection.countDocuments(
            { name: { $regex: searchNameTerm, $options: 'i' }})

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: blogsMapping(blogs)
        }
    },

    async findBlogById(_id: ObjectId): Promise<blogViewModelWithId | null> {
        const blog: blogModelWithMongoId | null = await blogsCollection.findOne({_id});
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
        const blog: blogModelWithMongoId | null = await blogsCollection.findOne({_id: new ObjectId(blogId)},{});
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