import {Blog, blogViewModel} from "../../models/blog-view-model";
import {ObjectId, SortDirection} from "mongodb";
import {blogsMapping} from "../../functions/mapping";
import {blogsPaginationViewModel} from "../../models/pagination-view-models";
import {BlogModel} from "../../schemas/blog-schema";
import {injectable} from "inversify";

@injectable()
export class BlogsQueryRepository {
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
            items: blogsMapping(allBlogs)//allBlogs.map((b: Blog) => b.getViewBlog())
        }
    }
    async findBlogById(_id: ObjectId): Promise<blogViewModel | null> {
        const blog: Blog | null = await BlogModel.findOne({_id});
        if (!blog) {
            return null
        }
        return Blog.getViewBlog(blog)
    }
    async findBlogByBlogId(blogId: string): Promise<blogViewModel | null> {
        const blog: Blog | null = await BlogModel.findOne({_id: new ObjectId(blogId)},{});
        if (!blog) {
            return null
        }
        return Blog.getViewBlog(blog)
    }
}