import { Request, Response, Router } from "express";
import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {UsersService} from "../domain/users-service";
import {CommentsService} from "../domain/comments-service";

export const testingRouter = Router({});

class TestingController {
    private blogsService: BlogsService;
    private postsService: PostsService;
    private usersService: UsersService;
    private commentsService: CommentsService;
    constructor() {
        this.blogsService = new BlogsService()
        this.postsService = new PostsService()
        this.usersService = new UsersService()
        this.commentsService = new CommentsService()
    }

    async deleteAll (req: Request, res: Response) {
        await this.blogsService.deleteAll();
        await this.postsService.deleteAll();
        await this.usersService.deleteAll();
        await this.commentsService.deleteAll();
        res.sendStatus(204);
    }
}
    const testingController = new TestingController()

testingRouter.delete("/all-data", testingController.deleteAll.bind(testingController))
