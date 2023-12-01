import {Router} from "express"
import {
    checkCodeInDb,
    checkEmailInDb, checkIfEmailConfirmed, checkRecoveryCodeInDb,
    emailValidationMiddleware,
    loginValidationMiddleware, newPasswordValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/authentication";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";
import {rateLimitMiddleware} from "../middlewares/rate-limit-middleware";
import {authController} from "../composition-root";

export const authRouter = Router({})

authRouter.post('/login',
    rateLimitMiddleware,
    errorsValidationMiddleware,
    authController.loginUser.bind(authController));

authRouter.post('/refresh-token', authController.getRefreshToken.bind(authController));
authRouter.post('/logout', authController.logoutUser.bind(authController));
authRouter.get('/me', authController.getUserInfo.bind(authController));

authRouter.post('/registration',
    rateLimitMiddleware,
    emailValidationMiddleware,
    checkEmailInDb,
    loginValidationMiddleware,
    passwordValidationMiddleware,
    errorsValidationMiddleware,
    authController.registerUser.bind(authController));

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    checkCodeInDb,
    errorsValidationMiddleware,
    authController.confirmRegistration.bind(authController));

authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    emailValidationMiddleware,
    checkIfEmailConfirmed,
    errorsValidationMiddleware,
    authController.resendEmail.bind(authController));

authRouter.post('/password-recovery',
    rateLimitMiddleware,
    emailValidationMiddleware,
    errorsValidationMiddleware,
    authController.recoverPassword.bind(authController));

authRouter.post('/new-password',
    rateLimitMiddleware,
    newPasswordValidationMiddleware,
    checkRecoveryCodeInDb,
    errorsValidationMiddleware,
    authController.updatePassword.bind(authController));