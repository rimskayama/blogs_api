
import {usersRepository} from "../repositories/mongodb/users-repository-mongodb";
export const checkEmailExists = async (email: string) => {

    const user = await usersRepository.findByLoginOrEmail(email);

    if (user) {
        return Promise.reject("User with that email already exists");
    }

};

export const checkLoginExists = async (login: string) => {

    const user = await usersRepository.findByLoginOrEmail(login);

    if (user) {
        return Promise.reject("User with that login already exists");
    }
};

export const checkCodeExists = async (confirmationCode: string) => {

    const user = await usersRepository.findByConfirmationCode(confirmationCode);

    if (!user) {
        return Promise.reject("Code is incorrect");
    }
};
export const checkRecoveryCodeExists = async (recoveryCode: string) => {

    const user = await usersRepository.findByRecoveryCode(recoveryCode);

    if (!user) {
        return Promise.reject("Code is incorrect");
    }
};