"use strict";
exports.__esModule = true;
exports.testingRouter = void 0;
var express_1 = require("express");
exports.testingRouter = (0, express_1.Router)({});
var blogs_DB_1 = require("../repositories/dataBase/blogs-DB");
var posts_DB_1 = require("../repositories/dataBase/posts-DB");
exports.testingRouter["delete"]("/all-data", function (req, res) {
    blogs_DB_1.blogs.splice(0, blogs_DB_1.blogs.length);
    posts_DB_1.posts.splice(0, blogs_DB_1.blogs.length);
    res.sendStatus(204);
});
