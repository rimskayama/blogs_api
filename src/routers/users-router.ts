import {Request, Response, Router} from "express"
import {usersService} from "../domain/users-service";
import {usersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {getPagination} from "../functions/pagination";
import {basicAuthMiddleware} from "../middlewares/basicAuth";
import {ObjectId} from "mongodb";
import {
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/usersValidationMiddleware";
import {errorsValidationMiddleware} from "../middlewares/errorsValidationMiddleware";

export const usersRouter = Router({})

usersRouter.get("/users", async (req: Request, res: Response) =>  {
    const {page, limit, sortDirection, sortBy, searchNameTerm, skip} = getPagination(req.query);
    const allUsers = await usersQueryRepository.findUsers(page, limit, sortDirection, sortBy, searchNameTerm, skip)
    res.status(200).json(allUsers)
})

usersRouter.get("/users/:id", async (req: Request, res: Response) => {
    let blog = await usersQueryRepository.findUserById(new ObjectId(req.params.id))
    if (blog) {
        res.json(blog);
    } else res.sendStatus(404)
})
usersRouter.post('/users',
    basicAuthMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware,
    emailValidationMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
    const newProduct = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        res.status(201).send(newProduct)
})

usersRouter.delete("/users/:id",
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const result = await usersService.deleteUser(new ObjectId(req.params.id));
        (result) ? res.sendStatus(204) : res.sendStatus(404);
    })
