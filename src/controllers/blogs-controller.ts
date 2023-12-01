import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {BlogsQueryRepository} from "../repositories/query-repos/blogs-query-repository-mongodb";
import {PostsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";
import {Request, Response} from "express";
import {getPagination} from "../functions/pagination";
import {ObjectId} from "mongodb";

export class BlogsController {
    constructor(
        protected blogsService: BlogsService,
        protected postsService: PostsService,
        protected blogsQueryRepository: BlogsQueryRepository,
        protected postsQueryRepository: PostsQueryRepository
    ) {
    }
    async getBlogs (req: Request, res: Response) {
        const {page, limit, sortDirection, sortBy, searchNameTerm, skip} = getPagination(req.query);
        const allBlogs = await this.blogsQueryRepository.findBlogs(page, limit, sortDirection, sortBy, searchNameTerm, skip)
        res.status(200).json(allBlogs)
    }
    async getBlog(req: Request, res: Response) {
        let blog = await this.blogsQueryRepository.findBlogById(new ObjectId(req.params.id))
        if (blog) {
            res.json(blog);
        } else res.sendStatus(404)
    }
    async getPostsOfBlog(req: Request, res: Response) {
        let checkBlog = await this.blogsQueryRepository.findBlogByBlogId(req.params.blogId);
        const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query);
        const blogId = req.params.blogId;
        if (checkBlog) {
            let posts = await this.postsQueryRepository.findPostsByBlogId(
                blogId, page, limit, sortDirection, sortBy, skip);
            res.status(200).json(posts);
        } else res.sendStatus(404)
    }
    async createBlog(req: Request, res: Response) {
        const newBlog = await this.blogsService.createBlog(
            req.body.name, req.body.description, req.body.websiteUrl);
        res.status(201).json(newBlog)
    }
    async createPostForSpecificBlog(req: Request, res: Response) {
        const newPost = await this.postsService.createPost(
            req.body.title, req.body.shortDescription,
            req.body.content,  req.params.blogId);
        if (newPost) {
            res.status(201).json(newPost)
        } else return res.sendStatus(404)
    }
    async updateBlog(req: Request, res: Response) {
        const updatedBlog = await this.blogsService.updateBlog(
            new ObjectId(req.params.id), req.body.name, req.body.description,
            req.body.websiteUrl, req.body.isMembership
        )
        if (updatedBlog) {
            res.sendStatus(204);
        } else res.status(404).send('Not Found');
    }
    async deleteBlog (req: Request, res: Response) {
        const result = await this.blogsService.deleteBlog(new ObjectId(req.params.id));
        (result) ? res.sendStatus(204) : res.sendStatus(404);
    }
}