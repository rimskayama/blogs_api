import {Router} from 'express'
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {postContentValidationMiddleware,
    postDescriptionValidationMiddleware,
    postTitleValidationMiddleware
} from "../middlewares/posts-validation-input";
import {blogIdCheck} from "../functions/check-blog-id";
import {commentContentValidationMiddleware} from "../middlewares/comments-validation-input";
import {authDevicesMiddleware} from "../middlewares/auth/auth-devices";
import {container} from "../composition-root";
import {PostsController} from "../controllers/posts-controller";

const postsController = container.resolve(PostsController)
export const postsRouter = Router({})

postsRouter.get("/", postsController.getPosts.bind(postsController))
postsRouter.get("/:id", postsController.getPost.bind(postsController))
postsRouter.post("/",
    basicAuthMiddleware,
    blogIdCheck,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    postsController.createPost.bind(postsController))
postsRouter.get("/:postId/comments", postsController.getCommentsOfPost.bind(postsController))

postsRouter.post('/:postId/comments',
    authDevicesMiddleware,
    commentContentValidationMiddleware,
    errorsValidationMiddleware,
    postsController.createCommentByPostId.bind(postsController))

postsRouter.put("/:id",
    basicAuthMiddleware,
    blogIdCheck,
    postTitleValidationMiddleware,
    postDescriptionValidationMiddleware,
    postContentValidationMiddleware,
    errorsValidationMiddleware,
    postsController.updatePost.bind(postsController))

postsRouter.delete("/:id",
    basicAuthMiddleware,
    postsController.deletePost.bind(postsController))
