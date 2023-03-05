/*import {body} from "express-validator";
import {blogsCollection} from "../repositories/db";

export const blogIdCheckMiddleware = body("blogId").custom(async ({req}) => {
    const idToFind = req.body.blogId;
    return await blogsCollection.indexExists(idToFind);
});
*/