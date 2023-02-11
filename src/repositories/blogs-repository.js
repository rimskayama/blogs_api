"use strict";
exports.__esModule = true;
exports.blogsRepository = void 0;
var blogs_DB_1 = require("./dataBase/blogs-DB");
var randomNumber_1 = require("./randomNumber");
exports.blogsRepository = {
    findBlogs: function (name) {
        if (name) {
            var allBlogs = blogs_DB_1.blogs.filter(function (b) { return b.name.indexOf(name) > -1; });
            return allBlogs;
        }
        else
            return blogs_DB_1.blogs;
    },
    findBlogById: function (id) {
        return blogs_DB_1.blogs.find(function (b) { return b.id === id; });
    },
    createBlog: function (name, description, websiteUrl) {
        var newBlog = {
            id: (0, randomNumber_1.randomNumber)(0, 999999),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        blogs_DB_1.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog: function (id, name, description, websiteUrl) {
        var updatedBlog = blogs_DB_1.blogs.find(function (b) { return b.id === id; });
        if (updatedBlog) {
            updatedBlog.name = name;
            updatedBlog.description = description;
            updatedBlog.websiteUrl = websiteUrl;
        }
        return updatedBlog;
    },
    deleteBlog: function (id) {
        for (var i = 0; i < blogs_DB_1.blogs.length; i++) {
            if (blogs_DB_1.blogs[i].id === id) {
                blogs_DB_1.blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
