import {Router} from "express";
import {commentContentValidationMiddleware,
    commentLikeValidationMiddleware} from "../middlewares/comments-validation-input";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {authDevicesMiddleware} from "../middlewares/auth/auth-devices";
import {container} from "../composition-root";
import {CommentsController} from "../controllers/comments-controller";

const commentsController = container.resolve(CommentsController)
export const commentsRouter = Router({})

commentsRouter.get("/:id", commentsController.getComment.bind(commentsController))

commentsRouter.put("/:id",
    authDevicesMiddleware,
    commentContentValidationMiddleware,
    errorsValidationMiddleware,
    commentsController.updateComment.bind(commentsController))

commentsRouter.put("/:id/like-status",
    authDevicesMiddleware,
    commentLikeValidationMiddleware,
    errorsValidationMiddleware,
    commentsController.updateLikeStatus.bind(commentsController))

commentsRouter.delete("/:id",
    authDevicesMiddleware,
    commentsController.deleteComment.bind(commentsController))

// get all likes
// commentsRouter.get("/:id/likes",
//     authDevicesMiddleware,
//     errorsValidationMiddleware,
//
//     async (req: Request, res: Response) => {
//         const token = req.headers.authorization!.split(' ')[1]
//         const userId = await jwtService.getUserIdByAccessToken(token)
//         const comment = await commentsService.findCommentById(req.params.id, userId);
//
//         if (!comment) {
//             res.sendStatus(404)
//         } else {
//             const commentLikes = await likesService.getCommentLikes(comment.id)
//             res.json(commentLikes)
//         }
// })