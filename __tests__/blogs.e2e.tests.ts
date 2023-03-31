import request from "supertest";
import {app} from "../src/app-config";
import {blogsRepository} from "../src/repositories/mongodb/blogs-repository-mongodb";

describe("/blogs", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    });

//GET
    it("should return 200 and blogs", async () => {
        await request(app).get("/blogs")
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it("should return 404 for not existing blogs", async () => {
        await request(app)
            .get("/blogs/6413437e44902b9011d0b316")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    })


//POST

    it("should NOT create blog with incorrect input data", async () => {
        await request(app)
            .post("/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send
            ({
                name: "veryverylongname",
                description: "string",
                websiteUrl: "string"
            })
            .expect(400);

        await request(app).get("/blogs").expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })
    });

    let createdBlog1: any = {id: 0};

    it("should create blog with correct input data", async () => {
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

        //console.log(b.body, 'list of blogs')

        expect(b.body).toEqual(
            {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [
                    {
                        id: expect.any(String),
                        name: 'string',
                        description: 'string',
                        websiteUrl: 'https://www.base64encode.org/',
                        createdAt: expect.any(String),
                        isMembership: false
                    }
                ]
            }

        )
    });


    it("should return posts for specific blog", async () => {
        await request(app).get("/blogs/" + createdBlog1.id + "/posts")
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })


    let createdPost1: any = {id: 0};


        it("should create post for specific blog", async () => {
            console.log(createdBlog1);
            const data = {
                content: "post content",
                shortDescription: "short Description",
                title: "post title",
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
                        }
                    ]
                }

            )
    });

    //PUT


        it("should NOT update blog with incorrect name", async () => {
            const data = {
                "name": "veryverylongname",
                "description": "new description",
                "websiteUrl": "https://vercel.com/"
            }

            await request(app)
                .put("/blogs/" + createdBlog1.id)
                .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                .send(data)
                .expect(400, {
                    errorsMessages: [
                        {
                            message: 'Name length should be minimum 1 and maximum 15 symbols',
                            field: 'name'
                        }]
                })

    //console.log(createdBlog1)


});

        it("should NOT update blog that not exist", async () => {
            await request(app)
                .put("/blogs/" + "642681e8ad245fa9580960f8")
                .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                .send({
                    "name": "new name",
                    "description": "new description",
                    "websiteUrl": "https://vercel.com/"
                })
                .expect(404);
        });

        console.log(createdBlog1)

        it("should update blog with correct input data", async () => {
             const data = {
                "name": "new name",
                "description": "new description",
                "websiteUrl": "https://vercel.com/"
            };

             await request(app)
                 .put("/blogs/" + createdBlog1.id)
                 .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                 .send(data)
                 .expect(204);

            const b = await request(app).get("/blogs/" + createdBlog1.id)
                .expect(200)

            expect(b.body).toEqual(
                {
                    id: expect.any(String),
                    name: 'new name',
                    description: 'new description',
                    websiteUrl: 'https://vercel.com/',
                    createdAt: expect.any(String),
                    isMembership: false
                })
        });

    //DELETE
        it("should delete blog", async () => {
            await request(app)
                .delete("/blogs/" + createdBlog1.id)
                .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                .expect(204);

            await request(app)
                .get("/blogs/" + createdBlog1.id)
                .expect(404);

            await request(app)
                .get("/blogs")
                .expect(200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                });
        });
})

