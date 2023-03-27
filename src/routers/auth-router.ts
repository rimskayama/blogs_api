import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {ObjectId} from "mongodb";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";

export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send(token)
        } else {
            res.sendStatus(401)
        }
})

authRouter.get('/me',
    authBearerMiddleware,
    async (req: Request, res: Response) => {
    let meUser = await usersQueryRepository.findUserById(new ObjectId(req.user!.id))
    res.status(200).json({
        userId: meUser?.id,
        login: meUser?.login,
        email: meUser?.email
    });

})