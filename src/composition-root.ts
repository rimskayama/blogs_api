import "reflect-metadata";
import {Container} from "inversify";
import {UsersRepository} from "./repositories/mongodb/users-repository-mongodb";
import {UsersService} from "./domain/users-service";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./controllers/auth-controller";
import {UsersController} from "./controllers/users-controller";
import {UsersQueryRepository} from "./repositories/query-repos/users-query-repository-mongodb";
import {TestingController} from "./controllers/testing-controller";
import {BlogsController} from "./controllers/blogs-controller";
import {BlogsRepository} from "./repositories/mongodb/blogs-repository-mongodb";
import {PostsRepository} from "./repositories/mongodb/posts-repository-mongodb";
import {PostsQueryRepository} from "./repositories/query-repos/posts-query-repository-mongodb";
import {CommentsRepository} from "./repositories/mongodb/comments-repository-mongodb";
import {BlogsService} from "./domain/blogs-service";
import {PostsService} from "./domain/posts-service";
import {CommentLikesRepository} from "./repositories/mongodb/comment-likes-repository";
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
import {BlogsQueryRepository} from "./repositories/query-repos/blogs-query-repository-mongodb";
import {PostLikesRepository} from "./repositories/mongodb/post-likes-repository";
export const container = new Container()

container.bind(TestingController).to(TestingController)

container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)
container.bind(JwtService).to(JwtService)
container.bind(APIsRepository).to(APIsRepository)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)

container.bind(LikesService).to(LikesService)
container.bind(CommentLikesRepository).to(CommentLikesRepository)
container.bind(PostLikesRepository).to(PostLikesRepository)

container.bind(DevicesController).to(DevicesController)
container.bind(DevicesService).to(DevicesService)
container.bind(DevicesRepository).to(DevicesRepository)
container.bind(DevicesQueryRepository).to(DevicesQueryRepository)