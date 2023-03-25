import {body} from "express-validator";
const loginPattern = /^[a-zA-Z0-9_-]*$/;
const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/


export const loginValidationMiddleware = body("login")
    .exists()
    .withMessage("login or email is required")
    .bail()

    .isString()
    .withMessage("type of login must be string")
    .bail()

    .trim()
    .isLength({min: 3, max: 10})
    .withMessage("login length should be minimum 3 and maximum 10 symbols")
    .bail()

    .matches(loginPattern)
    .withMessage("login must be in correct format")

export const passwordValidationMiddleware = body("password")
    .exists()
    .withMessage("password is required")
    .bail()

    .isString()
    .withMessage("type of password must be string")
    .bail()

    .trim()
    .isLength({min: 6, max: 20})
    .withMessage("password length should be minimum 6 and maximum 20 symbols")
    .bail()

export const emailValidationMiddleware = body("email")
    .exists()
    .withMessage("email is required")
    .bail()

    .isString()
    .withMessage("type of email must be string")
    .bail()

    .matches(emailPattern)
    .withMessage("email must be in correct format")


