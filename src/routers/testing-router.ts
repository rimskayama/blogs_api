import { Request, Response, Router } from "express";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

export const testingRouter = Router({});

// DELETE ALL
testingRouter.delete("/testing/all-data",
    async (req: Request, res: Response) => {
    const deleteBlogs = await blogsService.deleteAll();
    const deletePosts = await postsService.deleteAll();
    res.sendStatus(204);

})
