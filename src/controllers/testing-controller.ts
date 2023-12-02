import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {UsersService} from "../domain/users-service";
import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";

@injectable()
export class TestingController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(PostsService) protected postsService: PostsService,
        @inject(UsersService) protected usersService: UsersService,
        @inject(CommentsService) protected commentsService: CommentsService) {
    }

    async deleteAll (req: Request, res: Response) {
        await this.blogsService.deleteAll();
        await this.postsService.deleteAll();
        await this.usersService.deleteAll();
        await this.commentsService.deleteAll();
        res.sendStatus(204);
    }
}