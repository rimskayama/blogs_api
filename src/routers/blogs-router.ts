import {Request, Response, Router} from 'express'
import {BlogsService} from "../domain/blogs-service";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {blogDescriptionValidationMiddleware,
    blogNameValidationMiddleware, blogWebsiteUrlValidationMiddleware
} from "../middlewares/blogs-validation-input";
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {ObjectId} from "mongodb";
import {getPagination} from "../functions/pagination";
import {
    postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/posts-validation-input";
import {BlogsQueryRepository} from "../repositories/query-repos/blogs-query-repository-mongodb";
import {PostsQueryRepository} from "../repositories/query-repos/posts-query-repository-mongodb";
import {PostsService} from "../domain/posts-service";

export const blogsRouter = Router({})

class BlogsController {
    private blogsService: BlogsService;
    private postsService: PostsService;
    private blogsQueryRepository: BlogsQueryRepository;
    private postsQueryRepository: PostsQueryRepository;
    constructor() {
        this.blogsService = new BlogsService()
        this.postsService = new PostsService()
        this.blogsQueryRepository = new BlogsQueryRepository()
        this.postsQueryRepository = new PostsQueryRepository()
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
            let posts = await this.postsQueryRepository.findPostsByBlogId(blogId, page, limit, sortDirection, sortBy, skip);
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

const blogsController = new BlogsController()

blogsRouter.get("/", blogsController.getBlogs.bind(blogsController))
blogsRouter.get("/:id", blogsController.getBlog.bind(blogsController))
blogsRouter.get("/:blogId/posts", blogsController.getPostsOfBlog.bind(blogsController))

blogsRouter.post("/",
    basicAuthMiddleware,
    blogNameValidationMiddleware,
    blogDescriptionValidationMiddleware,
    blogWebsiteUrlValidationMiddleware,
    errorsValidationMiddleware,
    blogsController.createBlog.bind(blogsController))

blogsRouter.post("/:blogId/posts",
    basicAuthMiddleware,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware, blogsController.createPostForSpecificBlog.bind(blogsController))

blogsRouter.put("/:id",
    basicAuthMiddleware,
    blogNameValidationMiddleware,
    blogDescriptionValidationMiddleware,
    blogWebsiteUrlValidationMiddleware,
    errorsValidationMiddleware, blogsController.updateBlog.bind(blogsController))

blogsRouter.delete("/:id",
    basicAuthMiddleware, blogsController.deleteBlog.bind(blogsController))


