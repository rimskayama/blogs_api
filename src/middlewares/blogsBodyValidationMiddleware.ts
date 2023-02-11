import {body} from "express-validator";
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const blogNameValidationMiddleware = body("name")
        .exists()
        .trim()
        .isLength({min: 0, max: 15})
        .withMessage("name length should be maximum 15 symbols")

export const blogDescriptionValidationMiddleware = body("description")
    .exists()
    .trim()
    .isLength({min: 0, max: 500})
    .withMessage("description length should be maximum 500 symbols")

export const blogWebsiteUrlValidationMiddleware = body("websiteUrl")
    .exists()
    .trim()
    .isLength({min: 0, max: 100})
    .withMessage("websiteUrl length should be maximum 100 symbols")
    .matches(websiteUrlPattern)
    .withMessage("Website URL must be in correct format")
