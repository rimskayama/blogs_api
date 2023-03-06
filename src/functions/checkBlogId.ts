/*import {body} from "express-validator";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

export const blogIdCheckMiddleware = body("blogId").custom(async (value) => {
    const result = await blogsRepository.findBlogById(new ObjectId(value));
    if (!result) {
        throw new Error("ID not found");
    }
    return true;
});
*/

