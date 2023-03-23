import express from "express";
import {blogsRouter} from "./routers/blogs-router";
import {testingRouter} from "./routers/testing-router";
import {postsRouter} from "./routers/posts-router";
import {authRouter} from "./routers/auth-router";
import {usersRouter} from "./routers/users-router";


export const app = express();
app.use(express.json());


app.use("/", blogsRouter);
app.use("/", testingRouter);
app.use("/", postsRouter);
app.use("/", authRouter);
app.use("/", usersRouter);