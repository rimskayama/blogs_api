import {Router} from 'express'
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {blogDescriptionValidationMiddleware,
    blogNameValidationMiddleware, blogWebsiteUrlValidationMiddleware
} from "../middlewares/blogs-validation-input";
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {
    postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/posts-validation-input";
import {blogsController} from "../composition-root";

export const blogsRouter = Router({})

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


