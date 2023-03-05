"use strict";
exports.__esModule = true;
exports.blogsRouter = void 0;
var express_1 = require("express");
var blogs_repository_1 = require("../repositories/mongodb/blogs-repository-mongodb");
exports.blogsRouter = (0, express_1.Router)({});
//GET
exports.blogsRouter.get("/", function (req, res) {
    var allBlogs = blogs_repository_1.blogsRepository.findBlogs(req.body.name);
    res.status(200).json(allBlogs);
});
//GET WITH URI
exports.blogsRouter.get("/:id", function (req, res) {
    var blog = blogs_repository_1.blogsRepository.findBlogById(req.params.id);
    if (blog) {
        res.json(blog);
    }
    else
        res.sendStatus(404);
});
//POST
exports.blogsRouter.post("/", 
//body('name').isLength({max: 15}).withMessage("the name must have maximum 15"),
function (req, res) {
    /*const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }*/
    var newBlog = blogs_repository_1.blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    console.log('new', newBlog);
    res.status(201).json(newBlog);
    //PUT
    exports.blogsRouter.put("/:id", function (req, res) {
        var updatedBlog = blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
        if (updatedBlog) {
            res.sendStatus(204);
        }
        else {
            res.status(400).send('error');
        }
    });
    //DELETE
    exports.blogsRouter["delete"]("/:id", function (req, res) {
        var isDeleted = blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
        (isDeleted) ? res.sendStatus(204) : res.sendStatus(404);
    });
});
