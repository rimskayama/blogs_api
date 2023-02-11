import {blogs} from "./dataBase/blogs-DB";
import {blogsType} from "./dataBase/blogs-DB";
import {randomNumber} from "./randomNumber";

export const blogsRepository = {
    findBlogs(name: string) {
        if (name) {
            let allBlogs = blogs.filter(b => b.name.indexOf(name) > -1)
            return allBlogs;
        } else return blogs
    },
    findBlogById(id: string) {
        return blogs.find(b => b.id === id);
    },
    createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog : blogsType = {
            id: randomNumber(0,999999),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        blogs.push(newBlog);
        return newBlog
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        let updatedBlog = blogs.find(b => b.id === id);
        if (updatedBlog) {
            updatedBlog.name = name;
            updatedBlog.description = description;
            updatedBlog.websiteUrl = websiteUrl;
        }
        return updatedBlog
    },
    deleteBlog(id: string) {
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i, 1);
                return true;
            }
        }
        return false
}

}


