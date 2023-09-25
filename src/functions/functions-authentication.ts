
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
export const checkEmailExists = async (email: string) => {

    const user = await usersRepository.findByLoginOrEmail(email);

    if (user) {
        return Promise.reject("User with that email already exists");
    }

};

export const checkEmailNotExists = async (email: string) => {

    const user = await usersRepository.findByLoginOrEmail(email);

    if (!user) {
        return Promise.reject("User does not exist");
    }

};

export const checkLoginExists = async (login: string) => {

    const user = await usersRepository.findByLoginOrEmail(login);

    if (user) {
        return Promise.reject("User with that login already exists");
    }
};

export const checkCodeExists = async (code: string) => {

    const user = await usersRepository.findByConfirmationCode(code);

    if (!user) {
        return Promise.reject("Code is incorrect");
    }
};

export function subtractSeconds(date: Date, seconds: number) {
    date.setSeconds(date.getSeconds() - seconds);
    return date;
}