import request from "supertest";
import {app} from "../src/app-config";
import mongoose from "mongoose";

describe("/comments", () => {
    const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/blogs_api'

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
        await request(app).delete("/testing/all-data");
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

//POST /blogs

    let createdBlog1: any = {id: 0};

    it("should create blog for comments testing", async () => {
        const data = {
            "name": "string",
            "description": "string",
            "websiteUrl": "https://www.base64encode.org/"
        }
        const createResponse = await request(app)
            .post("/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(201);

        createdBlog1 = createResponse.body;
        //console.log(createdBlog1);

        const b = await request(app).get("/blogs")
            .expect(200)

    });

    let createdPost1: any = {id: 0};

// POST blogs/:blogId/posts

    it("should create post for comments testing", async () => {
        const data = {
            title: "post title",
            content: "post content",
            shortDescription: "short Description",
        }
        const createResponse = await request(app)
            .post("/blogs/" + createdBlog1.id + "/posts")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(201);

        createdPost1 = createResponse.body;

        const b = await request(app).get("/blogs/" + createdBlog1.id + "/posts")
            .expect(200)

        //console.log(b.body, 'list of posts for specific blog')

        expect(b.body).toEqual(
            {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [
                    {
                        id: expect.any(String),
                        title: "post title",
                        shortDescription: "short Description",
                        content: "post content",
                        blogId: createdBlog1.id,
                        blogName: createdPost1.blogName,
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                            dislikesCount: 0,
                            likesCount: 0,
                            myStatus: "None",
                            newestLikes: []
                        },
                    }
                ]
            }
        )
    });

//GET posts/:blogId/comments

    it("should return comments for specific post", async () => {
        await request(app).get("/posts/" + createdPost1.id + "/comments")
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

//POST auth/registration
    let createdUser1: any = {id: 0};
    it("should create user for comment testing", async () => {
        const data =
            {
                password: "qwerty1",
                email: "rimskayama@outlook.com",
                login: "login1"
            }

        const createResponse = await request(app)
            .post("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(201);

        createdUser1 = createResponse.body;
        //console.log(createdUser1)

        const b = await request(app).get("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(200)

        //console.log(b.body, 'list of users')

        expect(b.body).toEqual(
            {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [
                    {
                        id: expect.any(String),
                        login: "login1",
                        email: "rimskayama@outlook.com",
                        createdAt: expect.any(String)
                    }
                ]
            }
        )
    });

// POST auth/login -> get accessToken

    let accessToken = ''
    it("should login user to write comments", async () => {
        const data =
            {
                password: "qwerty1",
                loginOrEmail: "login1"
            }

        const createResponse = await request(app)
            .post("/auth/login")
            .send(data)
            .expect(200);

        accessToken = createResponse.body.accessToken;
    })

// POST posts/:postId/comments

    it("should NOT create comment without content", async () => {
        const data = {
            commentatorInfo: {
                userId: "64215c54ddc2a621252fc81f",
                userLogin: "12345"
            }
        }
        await request(app)
            .post("/posts/" + createdPost1.id + "/comments")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({accessToken: '123'})
            .send(data)
            .expect(400, {
                errorsMessages: [{message: 'content is required', field: 'content'}]
            })

        await request(app).get("/posts/" + createdPost1.id + "/comments").expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })
    });

//GET comments/:commentId

    it("should return 404 for not existing comment", async () => {
        await request(app)
            .get("/comments/6413437e44902b9011d0b316")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    })

//POST posts/:postId/comments

    let createdComment1: any = {id: 0};

    it("should create comment", async () => {
        const data = {
            content: "contentcontentcontent",
            commentatorInfo: {
                userId: "64215c54ddc2a621252fc81f",
                userLogin: "12345"
            }
        }
        const createResponse = await request(app)
            .post("/posts/" + createdPost1.id + "/comments")
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(201);

        createdComment1 = createResponse.body;
        //console.log(createdComment1)

        const b = await request(app).get("/posts/" + createdPost1.id + "/comments")
            .expect(200)

        expect(b.body).toEqual(
            {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [
                    {
                        id: expect.any(String),
                        content: "contentcontentcontent",
                        commentatorInfo: {
                            userId: createdUser1.id,
                            userLogin: createdUser1.login
                        },
                        createdAt: expect.any(String),
                        likesInfo: {
                            dislikesCount: 0,
                            likesCount: 0,
                            myStatus: "None"
                        }
                    }
                ]
            }
        )
    });

    //GET comments/:commentId

    it("should return comment by ID", async () => {
        const b = await request(app).get("/comments/" + createdComment1.id)
            .expect(200)

        expect(b.body).toEqual(
            {
                id: createdComment1.id,
                content: createdComment1.content,
                commentatorInfo: {
                    userId: createdComment1.commentatorInfo.userId,
                    userLogin: createdComment1.commentatorInfo.userLogin
                },
                createdAt: createdComment1.createdAt,
                likesInfo: {
                    dislikesCount: 0,
                    likesCount: 0,
                    myStatus: "None"
                }
            })
    })

//PUT comments/:commentId

    it("should NOT update comment that not exist", async () => {
        const data = {
            "content": "12345678902345678912345678901"
        }
        await request(app)
            .put("/comments/" + "642681e8ad245fa9580960f8")
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(404);
    });

    it("should NOT update comment with short content", async () => {
        const data = {
            "content": "content"
        }

        await request(app)
            .put("/comments/" + createdComment1.id)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(400, {
                errorsMessages: [
                    {
                        message: 'content length should be minimum 20 and maximum 300 symbols',
                        field: 'content'
                    }
                ]
            })

    });

    it("should update comment with correct input data", async () => {
        const data = {
            content: "something interesting"
        }

        await request(app)
            .put("/comments/" + createdComment1.id)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(204);

        const b = await request(app).get("/comments/" + createdComment1.id)
            .expect(200)

        expect(b.body).toEqual(
            {
                id: createdComment1.id,
                content: data.content,
                commentatorInfo: {
                    userId: createdComment1.commentatorInfo.userId,
                    userLogin: createdComment1.commentatorInfo.userLogin
                },
                createdAt: createdComment1.createdAt,
                likesInfo: {
                    dislikesCount: 0,
                    likesCount: 0,
                    myStatus: "None"
                }
            })
        createdComment1.content = data.content
    });

//LIKES

        it("should return status None without authorization", async () => {
            const b = await request(app).get("/comments/" + createdComment1.id)
            .expect(200)

        expect(b.body).toEqual(
            {
                id: createdComment1.id,
                content: createdComment1.content,
                commentatorInfo: {
                    userId: createdComment1.commentatorInfo.userId,
                    userLogin: createdComment1.commentatorInfo.userLogin
                },
                createdAt: createdComment1.createdAt,
                likesInfo: {
                    dislikesCount: 0,
                    likesCount: 0,
                    myStatus: "None"
                }
            })
    })

    it("should set like status, dislike", async () => {
        const data = {
            "likeStatus": "Dislike"
        }
        await request(app)
            .put("/comments/" + createdComment1.id + "/like-status")
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(204);

        const b = await request(app).get("/comments/" + createdComment1.id)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        expect(b.body).toEqual(
            {
                id: createdComment1.id,
                content: createdComment1.content,
                commentatorInfo: {
                    userId: createdComment1.commentatorInfo.userId,
                    userLogin: createdComment1.commentatorInfo.userLogin
                },
                createdAt: createdComment1.createdAt,
                likesInfo: {
                    dislikesCount: 1,
                    likesCount: 0,
                    myStatus: "Dislike"
                }
            })
    })

    it("should set like status, like", async () => {
        const data = {
            "likeStatus": "Like"
        }
        await request(app)
            .put("/comments/" + createdComment1.id + "/like-status")
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(204);

        const b = await request(app).get("/comments/" + createdComment1.id)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        expect(b.body).toEqual(
            {
                id: createdComment1.id,
                content: createdComment1.content,
                commentatorInfo: {
                    userId: createdComment1.commentatorInfo.userId,
                    userLogin: createdComment1.commentatorInfo.userLogin
                },
                createdAt: createdComment1.createdAt,
                likesInfo: {
                    dislikesCount: 0,
                    likesCount: 1,
                    myStatus: "Like"
                }
            })
    })

    it("should set like status, None", async () => {
        const data = {
            "likeStatus": "None"
        }
        await request(app)
            .put("/comments/" + createdComment1.id + "/like-status")
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(204);

        const b = await request(app).get("/comments/" + createdComment1.id)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        expect(b.body).toEqual(
            {
                id: createdComment1.id,
                content: createdComment1.content,
                commentatorInfo: {
                    userId: createdComment1.commentatorInfo.userId,
                    userLogin: createdComment1.commentatorInfo.userLogin
                },
                createdAt: createdComment1.createdAt,
                likesInfo: {
                    dislikesCount: 0,
                    likesCount: 0,
                    myStatus: "None"
                }
            })
    })

//DELETE
    it("should delete comment", async () => {
        await request(app)
            .delete("/comments/" + createdComment1.id)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204);

        await request(app)
            .get("/comments/" + createdComment1.id)
            .expect(404);

        await request(app)
            .get("/posts/" + createdPost1.id + "/comments")
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
    });

    it("should NOT delete comment that doesn't exist", async () => {
        await request(app)
            .delete("/comments/" + createdComment1.id)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);

        await request(app)
            .get("/comments/" + createdComment1.id)
            .expect(404);

    });
})
