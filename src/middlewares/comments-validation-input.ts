import {body} from "express-validator";
import {checkLikeStatus} from "../functions/check-like-status";
import {commentsService} from "../domain/comments-service";

class Error{
    data = null;
    errorCode = 400;
    constructor(errorData: any, code: number) {
        this.data = errorData;
        this.errorCode = code;
    }
}

export const commentContentValidationMiddleware = body("content")

    .exists().withMessage("content is required")

    .isString().withMessage("type of content must be string")

    .trim().isLength({min: 20, max: 300})
    .withMessage("content length should be minimum 20 and maximum 300 symbols")

export const commentLikeValidationMiddleware = body("likeStatus")

    .exists().withMessage("likeStatus is required")

    .isString().withMessage("type of likeStatus must be string")

    .trim().custom( (value) => {
        return checkLikeStatus(value)
    })

export const commentValidationMiddleware =
    async (id: string, userId: string): Promise<Error | null> => {
        const foundComment = await commentsService.findCommentById(id, userId);
        if (!foundComment) return new Error(null, 404)

        const userIdFromReq = foundComment?.commentatorInfo.userId;

        if (userId !== userIdFromReq) {
            return new Error(null, 403)
        }
        return null
    }