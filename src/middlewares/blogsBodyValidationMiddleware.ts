import {body} from "express-validator";
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const blogNameValidationMiddleware = body("name")
    .exists()
    .bail()

    .isLength({min: 3, max: 15})
    .withMessage("name length should be minimum 3 and maximum 15 symbols")


export const blogDescriptionValidationMiddleware = body("description")
    .exists()
    .bail()

    .isLength({min: 3, max: 500})
    .withMessage("description length should be minimum 3 and maximum 500 symbols")

export const blogWebsiteUrlValidationMiddleware = body("websiteUrl")
    .exists()
    .bail()

    .isLength({min: 3, max: 100})
    .withMessage("websiteUrl length should be minimum 3 and maximum 100 symbols")
    .bail()

    .matches(websiteUrlPattern)
    .withMessage("Website URL must be in correct format")