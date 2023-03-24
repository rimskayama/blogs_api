import { Request, Response, Router } from "express";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {usersService} from "../domain/users-service";

export const testingRouter = Router({});

// DELETE ALL
testingRouter.delete("/testing/all-data",
    async (req: Request, res: Response) => {
    const deleteBlogs = await blogsService.deleteAll();
    const deletePosts = await postsService.deleteAll();
    const deleteUsers = await usersService.deleteAll();
    res.sendStatus(204);

})
