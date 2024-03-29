import {body} from "express-validator";
import {
    checkCodeExists, checkEmailConfirmed,
    checkEmailExists, checkLoginExists, checkRecoveryCodeExists
} from "../functions/functions-authentication";
const loginPattern = /^[a-zA-Z0-9_-]*$/;
const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/


export const loginValidationMiddleware = body("login")

    .exists().withMessage("login or email is required")

    .isString().withMessage("type of login must be string")

    .trim().isLength({min: 3, max: 10})
    .withMessage("login length should be minimum 3 and maximum 10 symbols")

    .matches(loginPattern)
    .withMessage("login must be in correct format")

    .custom( (value) => {
        return checkLoginExists(value)
    })

export const passwordValidationMiddleware = body("password")

    .exists().withMessage("password is required")

    .isString().withMessage("type of password must be string")

    .trim().isLength({min: 6, max: 20})
    .withMessage("password length should be minimum 6 and maximum 20 symbols")

export const newPasswordValidationMiddleware = body("newPassword")

    .exists().withMessage("password is required")

    .isString().withMessage("type of password must be string")

    .trim().isLength({min: 6, max: 20})
    .withMessage("password length should be minimum 6 and maximum 20 symbols")

export const emailValidationMiddleware = body("email")
    .exists().withMessage("email is required")

    .isString().withMessage("type of email must be string")

    .matches(emailPattern).withMessage("email must be in correct format")

export const checkEmailInDb = body("email")
    .custom( (value) => {
        return checkEmailExists(value)
    })

export const checkIfEmailConfirmed = body("email")
    .custom( (value) => {
        return checkEmailConfirmed(value)
    })


export const checkCodeInDb = body("code")
    .isString()
    .custom((value) => {
        return checkCodeExists(value)
})
export const checkRecoveryCodeInDb = body("recoveryCode")
    .isString()
    .custom((value) => {
        return checkRecoveryCodeExists(value)
    })




