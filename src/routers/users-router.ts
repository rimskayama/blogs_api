import {Router} from "express"
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {
    checkEmailInDb,
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/authentication";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {usersController} from "../composition-root";

export const usersRouter = Router({})

usersRouter.get("/",
    basicAuthMiddleware, usersController.getUsers.bind(usersController))
usersRouter.get("/:id", usersController.getUser.bind(usersController))
usersRouter.post('/',
    basicAuthMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware,
    emailValidationMiddleware,
    checkEmailInDb,
    errorsValidationMiddleware,
    usersController.createUser.bind(usersController))

usersRouter.delete("/:id",
    basicAuthMiddleware, usersController.deleteUser.bind(usersController))


