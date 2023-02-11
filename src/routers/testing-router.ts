import { Request, Response, Router } from "express";
export const testingRouter = Router({});
import {blogs} from "../repositories/dataBase/blogs-DB";
import {posts} from "../repositories/dataBase/posts-DB";


testingRouter.delete("/all-data", (req: Request, res: Response) => {
        blogs.splice(0, blogs.length);
        posts.splice(0, blogs.length);
    res.sendStatus(204)
});

