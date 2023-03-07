import express from "express";
import {blogsRouter} from "./routers/blogs-router";
import {testingRouter} from "./routers/testing-router";
import {postsRouter} from "./routers/posts-router";
import {runDB} from "./repositories/db";

export const app = express();
const port = process.env.PORT || 5000

app.use(express.json());



app.use("/blogs", blogsRouter);
app.use("/testing", testingRouter);
app.use("/posts", postsRouter);

const startApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};

startApp();
