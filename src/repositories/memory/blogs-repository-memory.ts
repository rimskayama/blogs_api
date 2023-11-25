
import {blogViewModel} from "../../models/blog-view-model";
import {randomNumber} from "../../functions/randomNumber";

const blogs : blogViewModel[] = []

export const blogsRepository  = {
    async findBlogs() : Promise<blogViewModel[]> {
        return blogs
    },
    async findBlogById(id: string) : Promise<blogViewModel | undefined> {
        return blogs.find(b => b?.id === id);
    },
    async createBlog(name: string, description: string, websiteUrl: string) : Promise<blogViewModel> {
        const newBlog : blogViewModel = {
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
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) : Promise<blogViewModel | undefined> {
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


