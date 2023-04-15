import {body} from "express-validator";
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
export const emailCheckExists = body("email").custom(async (value) => {
    const checkUser = await usersRepository.findByLoginOrEmail(value)
    if (checkUser) {
        throw new Error("User exists")
    }
})

export const emailCheckNotExist = body("email").custom(async (value) => {
    const checkUser = await usersRepository.findByLoginOrEmail(value)
    if (!checkUser) {
        throw new Error("User does not exist")
    }
})