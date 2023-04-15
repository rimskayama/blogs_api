import {body} from "express-validator";

export const commentContentValidationMiddleware = body("content")

    .exists().withMessage("content is required")

    .isString().withMessage("type of content must be string")

    .trim().isLength({min: 20, max: 300})
    .withMessage("content length should be minimum 20 and maximum 300 symbols")
