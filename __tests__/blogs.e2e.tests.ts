import request from "supertest";
import {app} from "../src/app-config";
import {blogsCollection} from "../src/repositories/db";
import {ObjectId} from "mongodb";

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

        const b = await request(app).get("/blogs")
            .expect(200)

        console.log(b.body, 'list of blogs')

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

    /*
    //PUT


        it("should NOT update blog with incorrect input data", async () => {
            const data = {
                "name": "string",
                "description": "string",
                "websiteUrl": "string"
            }

            await request(app)
                .put("/blogs/" + createdBlog1.id)
                .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                .send(data)
                .expect(400);

            await request(app)
                .get("/blogs/" + createdBlog1.id)
                .expect(200, createdBlog1);
        });

        it("should NOT update blog that not exist", async () => {
            await request(app)
                .put("/blogs/" + -10)
                .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                .send({ name: "good name" })
                .expect(404);
        });

        it("should update blog with correct input data", async () => {
             const data = { name: "good new name" };
             await request(app)
                 .put("/blogs/" + createdBlog1.id)
                 .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                 .send({ name: "good new name" })
                 .expect(204);

             await request(app)
                 .get("/blogs/" + createdBlog1._id)
                 .expect(200, {
                     name: data.name,
                     description: createdBlog1.description,
                     websiteUrl: createdBlog1.websiteUrl,
                 });
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
                .expect(200, []);
        });
*/
})

