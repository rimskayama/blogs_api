
import {blogViewModel, blogViewModelWithId} from "../../models/blog-view-model";
import {randomNumber} from "../../functions/randomNumber";

const blogs : blogViewModelWithId[] = []

export const blogsRepository  = {
    async findBlogs() : Promise<blogViewModelWithId[]> {
        return blogs
    },
    async findBlogById(id: string) : Promise<blogViewModelWithId | undefined> {
        return blogs.find(b => b?.id === id);
    },
    async createBlog(name: string, description: string, websiteUrl: string, createdAt: string, isMembership: boolean) : Promise<blogViewModelWithId> {
        const newBlog : blogViewModelWithId = {
            id: randomNumber(0,999999),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: (new Date()).toISOString(),
            isMembership: false
        }
        blogs.push(newBlog);
        return newBlog
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) : Promise<blogViewModelWithId | undefined> {
        let updatedBlog = blogs.find(b => b?.id === id);
        if (updatedBlog) {
            updatedBlog.name = name;
            updatedBlog.description = description;
            updatedBlog.websiteUrl = websiteUrl;
        }
        return updatedBlog
    },
    async deleteBlog(id: string) {
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i]?.id === id) {
                blogs.splice(i, 1);
                return true;
            }
        }
        return false
}

}


