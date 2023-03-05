import {body} from "express-validator";
import {blogsCollection} from "../repositories/db";
import {blogsRepository} from "../repositories/mongodb/blogs-repository-mongodb";

export const postTitleValidationMiddleware = body("title")
    .exists()
    .withMessage('title is required')
    .bail()

    .isString()
    .withMessage("type of title must be string")
    .bail()

    .trim()
    .isLength({min: 1, max: 30})
    .withMessage("name length should be minimum 1 and maximum 30 symbols")

export const postDescriptionValidationMiddleware = body("shortDescription")
    .exists()
    .withMessage('short description is required')
    .bail()

    .isString()
    .withMessage("type of short description must be string")
    .bail()

    .trim()
    .isLength({min: 1, max: 100})
    .withMessage("short description length should be minimum 1 and maximum 100 symbols")

export const postContentValidationMiddleware = body("content")
    .exists()
    .withMessage('content is required')
    .bail()

    .isString()
    .withMessage("type of content must be string")
    .bail()

    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage("content length should be minimum 1 and maximum 100 symbols")

export const blogIdValidationMiddleware = body("blogId")
    .exists()
    .withMessage("blog Id is required")
    .bail()

    .isString()
    .withMessage("type of blog Id must be string")
