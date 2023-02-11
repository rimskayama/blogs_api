import {body} from "express-validator";

export const postTitleValidationMiddleware = body("title")
    .exists()
    .bail()

    .isLength({min: 0, max: 30})
    .withMessage("name length should be maximum 30 symbols")

export const postDescriptionValidationMiddleware = body("shortDescription")
    .exists()
    .bail()
    .isLength({min: 0, max: 100})
    .withMessage("short description length should be maximum 100 symbols")

export const postContentValidationMiddleware = body("content")
    .exists()
    .bail()
    .isLength({min: 0, max: 1000})
    .withMessage("content length should be maximum 100 symbols")

export const checkBlogIdMiddleware = body("blogId")
    .exists()
    .withMessage("blog should exist")
    .bail()

    .isString()
    .withMessage("type of blog Id must be string")

