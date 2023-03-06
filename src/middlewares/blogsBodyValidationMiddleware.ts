import {body} from "express-validator";
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const blogNameValidationMiddleware = body("name")
    .exists()
    .withMessage("name is required")
    .bail()

    .isString()
    .withMessage("type of name must be string")
    .bail()

    .trim()
    .isLength({min: 1, max: 15})
    .withMessage("Name length should be minimum 1 and maximum 15 symbols");


export const blogDescriptionValidationMiddleware = body("description")
    .exists()
    .withMessage("description is required")
    .bail()

    .isString()
    .withMessage("type of description must be string")
    .bail()

    .trim()
    .isLength({min: 1, max: 500})
    .withMessage("description length should be minimum 1 and maximum 500 symbols");

export const blogWebsiteUrlValidationMiddleware = body("websiteUrl")
    .exists()
    .withMessage('websiteURL is required')
    .bail()

    .isLength({min: 1, max: 100})
    .withMessage("websiteUrl length should be minimum 1 and maximum 100 symbols")
    .bail()

    .matches(websiteUrlPattern)
    .withMessage("website URL must be in correct format")

export const membershipValidationMiddleware = body("isMemberShip")
    .isBoolean()
    .withMessage("type must be boolean")
    .bail()