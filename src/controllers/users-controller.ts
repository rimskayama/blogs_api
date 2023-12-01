import {UsersService} from "../domain/users-service";
import {UsersQueryRepository} from "../repositories/query-repos/users-query-repository-mongodb";
import {Request, Response} from "express";
import {getPagination} from "../functions/pagination";
import {ObjectId} from "mongodb";

export class UsersController {
    constructor(protected usersService: UsersService,
                protected usersQueryRepository: UsersQueryRepository) {
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