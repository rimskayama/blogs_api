import {body} from "express-validator";
import {commentsQueryRepository} from "../repositories/query-repos/comments-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {deviceInputModel} from "../models/device-model";

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

export const commentValidationMiddleware =
    async (id: string, session: deviceInputModel): Promise<Error | null> => {
        const foundComment = await commentsQueryRepository.findCommentById(new ObjectId(id));
        if (!foundComment) return new Error(null, 404)

        const userId = foundComment?.commentatorInfo.userId;

        if (session.userId !== userId) {
            return new Error(null, 403)
        }

        return null
    }
