import {body} from "express-validator";
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
export const emailCheck = body("email").custom(async (value) => {
    const checkUser = await usersRepository.findByLoginOrEmail(value)
    if (checkUser) {
        throw new Error("User exists")
    }
})