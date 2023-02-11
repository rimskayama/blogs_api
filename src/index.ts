import express from "express";
import {blogsRouter} from "./routers/blogs-router";
import {testingRouter} from "./routers/testing-router";
import {postsRouter} from "./routers/posts-router";

export const app = express();
const port = 3001;


app.use(express.json())

app.use("/testing", testingRouter);
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});