import {UsersRepository} from "./repositories/mongodb/users-repository-mongodb";
import {UsersService} from "./domain/users-service";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./controllers/auth-controller";
import {UsersController} from "./controllers/users-controller";
import {UsersQueryRepository} from "./repositories/query-repos/users-query-repository-mongodb";
import {TestingController} from "./controllers/testing-controller";
import {BlogsController} from "./controllers/blogs-controller";
import {BlogsRepository} from "./repositories/mongodb/blogs-repository-mongodb";
import {BlogsQueryRepository} from "./repositories/query-repos/blogs-query-repository-mongodb";
import {PostsRepository} from "./repositories/mongodb/posts-repository-mongodb";
import {PostsQueryRepository} from "./repositories/query-repos/posts-query-repository-mongodb";
import {CommentsRepository} from "./repositories/mongodb/comments-repository-mongodb";
import {BlogsService} from "./domain/blogs-service";
import {PostsService} from "./domain/posts-service";
import {LikesRepository} from "./repositories/mongodb/likes-repository";
import {DevicesRepository} from "./repositories/mongodb/devices-repository-mongodb";
import {PostsController} from "./controllers/posts-controller";
import {JwtService} from "./application/jwt-service";
import {CommentsService} from "./domain/comments-service";
import {CommentsQueryRepository} from "./repositories/query-repos/comments-query-repository-mongodb";
import {CommentsController} from "./controllers/comments-controller";
import {DevicesService} from "./domain/devices-service";
import {LikesService} from "./domain/likes-service";
import {DevicesController} from "./controllers/devices-controller";
import {DevicesQueryRepository} from "./repositories/query-repos/devices-query-repository";
import {APIsRepository} from "./repositories/mongodb/apis-repository";


const blogsRepository = new BlogsRepository()
const blogsQueryRepository = new BlogsQueryRepository()

const postsRepository = new PostsRepository()
const postsQueryRepository = new PostsQueryRepository()

const usersRepository = new UsersRepository()
const usersQueryRepository = new UsersQueryRepository()

const commentsRepository = new CommentsRepository()
const commentsQueryRepository = new CommentsQueryRepository()

const likesRepository = new LikesRepository()

const devicesRepository = new DevicesRepository()
const devicesQueryRepository = new DevicesQueryRepository()

export const apisRepository = new APIsRepository()

const blogsService = new BlogsService(blogsRepository, blogsQueryRepository)
const postService = new PostsService(blogsRepository, postsRepository, postsQueryRepository)
const usersService = new UsersService(usersRepository)
const jwtService = new JwtService()
export const commentsService = new CommentsService(
    commentsRepository, commentsQueryRepository, postsQueryRepository, usersQueryRepository)
const authService = new AuthService(usersRepository, usersService)
const devicesService = new DevicesService(jwtService, devicesRepository)
const likesService = new LikesService(likesRepository, usersQueryRepository)

export const blogsController = new BlogsController(
    blogsService, postService, blogsQueryRepository, postsQueryRepository)

export const postsController = new PostsController(
    postService, commentsService, jwtService, postsQueryRepository, commentsQueryRepository)
export const authController = new AuthController(
    usersService, authService, devicesService, jwtService, usersQueryRepository)
export const usersController = new UsersController(usersService, usersQueryRepository)

export const commentsController = new CommentsController(
    commentsService, likesService, commentsRepository, commentsQueryRepository, jwtService)

export const devicesController = new DevicesController(devicesService, devicesQueryRepository)

export const testingController = new TestingController(blogsService, postService, usersService, commentsService)