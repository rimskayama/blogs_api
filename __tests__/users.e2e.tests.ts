import request from "supertest";
import {app} from "../src/app-config";

describe("/users", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    });

//GET
    it("should return 200 and users", async () => {
        await request(app).get("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it("should return 404 for not existing user", async () => {
        await request(app)
            .get("/users/6413437e44902b9011d0b316")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    })



// POST

    let createdUser1: any = {id: 0};

    it("should NOT create user with incorrect login", async () => {
        const data = {
            "login": "12345678910",
            "password": "string",
            "email": "asdfg@gmail.com"
        }
        await request(app)
            .post("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(400);

        await request(app).get("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })
    });


    it("should create user with correct input data", async () => {
        const data = {
            "login": "login",
            "password": "string",
            "email": "asdfg@gmail.com"
        }
        const createResponse = await request(app)
            .post("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(201);

        createdUser1 = createResponse.body;
        //console.log(createdUser1);

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
                        login: createdUser1.login,
                        email: createdUser1.email,
                        createdAt: expect.any(String),
                    }
                ]
            }
        )
    });

//DELETE

    it("should NOT delete user that not exist", async () => {
        await request(app)
            .delete("/users/" + '6426b691b5ac688d25825932')
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);

    });


    it("should delete user", async () => {
        await request(app)
            .delete("/users/" + createdUser1.id)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);

        await request(app)
            .get("/users/" + createdUser1.id)
            .expect(404);

        await request(app)
            .get("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
    });

})

