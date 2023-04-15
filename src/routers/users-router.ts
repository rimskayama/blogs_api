import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {getPagination} from "../functions/pagination";
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {ObjectId} from "mongodb";
import {
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/authentication";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";

export const usersRouter = Router({})

usersRouter.get("/",
    basicAuthMiddleware,
    async (req: Request, res: Response) =>  {
    const {page, limit, sortDirection, sortBy, skip, searchLoginTerm, searchEmailTerm} = getPagination(req.query);
    const allUsers = await usersQueryRepository.findUsers(page, limit, sortDirection, sortBy, skip, searchLoginTerm, searchEmailTerm)
    res.status(200).json(allUsers)
})

usersRouter.get("/:id", async (req: Request, res: Response) => {
    let user = await usersQueryRepository.findUserById(new ObjectId(req.params.id))
    if (user) {
        res.json(user);
    } else res.sendStatus(404)
})
usersRouter.post('/',
    basicAuthMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware,
    emailValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
    const newProduct = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        res.status(201).send(newProduct)
})

usersRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const result = await usersService.deleteUser(new ObjectId(req.params.id));
        (result) ? res.sendStatus(204) : res.sendStatus(404);
    })
