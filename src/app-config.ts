import express from "express";
import cookieParser from 'cookie-parser'

import {blogsRouter} from "./routers/blogs-router";
import {testingRouter} from "./routers/testing-router";
import {postsRouter} from "./routers/posts-router";
import {authRouter} from "./routers/auth-router";
import {usersRouter} from "./routers/users-router";
import {commentsRouter} from "./routers/comments-router";
import {devicesRouter} from "./routers/devices-router";

export const app = express();
app.use(express.json());

app.use(cookieParser())

app.use("/blogs", blogsRouter);
app.use("/testing", testingRouter);
app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);
app.use("/security/devices", devicesRouter)