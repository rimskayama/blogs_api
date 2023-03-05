import request from "supertest";
import {app} from "../index";

describe("/blogs", () => {
    beforeAll(async () => {
        await request(app).delete("/__test__/data");
    });

//GET
    it("should return 200 and blogs", async () => {
        await request(app).get("/blogs").expect(200, []);
    })

    it("should return 404 for not existing blogs", async () => {
        await request(app).get("/blogs/1").expect(404);
    })

    //POST

    it("should NOT create blog with incorrect input data", async () => {
        const data = {
            "name": "stringstringstringstringstringstringstring",
            "description": "string",
            "websiteUrl": "string"
        };
        await request(app)
            .post("/blogs")
            .send(data)
            .expect(400);
        await request(app).get("/blogs").expect(200, [])
        console.log()
    });

    let createdBlog1: any = {id: 0 };

    it("should create blog with correct input data", async () => {
        const data = {
            "name": "string",
            "description": "string",
            "websiteUrl": "string"
        }
        const createResponse = await request(app)
            .post("/blogs")
            .send(data)
            .expect(201);
        createdBlog1 = createResponse.body;
        expect(createdBlog1).toEqual({
            id: expect.any(String),
            name: "string",
            description: "string",
            websiteUrl: "string"
        });
        await request(app)
            .get("/blogs")
            .expect(200, [createdBlog1]);
        console.log(createdBlog1.id)
    });

//PUT

    it("should NOT update blog with incorrect input data", async () => {
        const data = {
            "name": "string",
            "description": "string",
            "websiteUrl": "string"
        }

        await request(app)
            .put("/blogs/" + createdBlog1.id)
            .send(data)
            .expect(400);
        await request(app)
            .get("/blogs/" + createdBlog1.id)
            .expect(200, createdBlog1);
    });

    it("should NOT update blog that not exist", async () => {
        await request(app)
            .put("/blogs/" + -10)
            .send({ name: "good name" })
            .expect(404);
    });

    /* it("should update blog with correct input data", async () => {
         const data = { name: "good new name" };
         await request(app)
             .put("/blogs/" + createdBlog1.id)
             .send({ name: "good new name" })
             .expect(204);

         await request(app)
             .get("/blogs/" + createdBlog1.id)
             .expect(200, {
                 ...blogs[createdBlog1.id],
                 name: data.name,
             });
     });
 */
//DELETE
    it("should delete blog", async () => {
        await request(app)
            .delete("/blogs/" + createdBlog1.id)
            .expect(204);

        await request(app)
            .get("/blogs/" + createdBlog1.id)
            .expect(404);

        await request(app)
            .get("/blogs")
            .expect(200, []);
    });
});
