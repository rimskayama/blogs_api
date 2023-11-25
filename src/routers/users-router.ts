import {Request, Response, Router} from "express"
import {UsersService} from "../domain/users-service";
import {UsersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {getPagination} from "../functions/pagination";
import {basicAuthMiddleware} from "../middlewares/auth/auth-basic";
import {ObjectId} from "mongodb";
import {
    checkEmailInDb,
    emailValidationMiddleware,
    loginValidationMiddleware,
    passwordValidationMiddleware
} from "../middlewares/authentication";
import {errorsValidationMiddleware} from "../middlewares/errors-validation";

export const usersRouter = Router({})

class UsersController {
    private usersService: UsersService;
    private usersQueryRepository: UsersQueryRepository;
    constructor() {
        this.usersService = new UsersService()
        this.usersQueryRepository = new UsersQueryRepository()
    }
    async getUsers (req: Request, res: Response) {
        const {page, limit, sortDirection, sortBy, skip, searchLoginTerm, searchEmailTerm} = getPagination(req.query);
        const allUsers = await this.usersQueryRepository.findUsers(
            page, limit, sortDirection, sortBy, skip, searchLoginTerm, searchEmailTerm)
        res.status(200).json(allUsers)
    }
    async getUser (req: Request, res: Response) {
        let user = await this.usersQueryRepository.findUserById(new ObjectId(req.params.id))
        if (user) {
            res.json(user);
        } else res.sendStatus(404)
    }
    async createUser (req: Request, res: Response) {
        const newUser = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
        res.status(201).send(newUser)
    }
    async deleteUser (req: Request, res: Response) {
        const result = await this.usersService.deleteUser(new ObjectId(req.params.id));
        (result) ? res.sendStatus(204) : res.sendStatus(404);
    }
}

const usersController = new UsersController()

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


