
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
export const checkEmailExist = async (email: string) => {

    const user = await usersRepository.findByLoginOrEmail(email);

    if (user) {
        return Promise.reject("User with that email already exists");
    }

};

export const checkEmailNotExist = async (email: string) => {

    const user = await usersRepository.findByLoginOrEmail(email);

    if (!user) {
        return Promise.reject("User does not exist");
    }

};

export const checkCodeExist = async (code: string) => {

    const user = await usersRepository.findByConfirmationCode(code);

    if (!user) {
        return Promise.reject("Code is incorrect");
    }
};