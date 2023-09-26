import request from "supertest";
import {app} from "../src/app-config";
describe("/auth", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    });

    let createdUser1: any = {id: 0};
    it("should create user with confirmed email", async () => {
        const data =
            {   password: "qwerty1",
                email: "rimskayama@outlook.com",
                login: "login1"
            }

        const createResponse = await request(app)
            .post("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(201);

        createdUser1 = createResponse.body;

        const b = await request(app).get("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
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
                        login: "login1",
                        email:"rimskayama@outlook.com",
                        createdAt: expect.any(String)
                    }
                ]
            }
        )
    });

// POST auth/login -> get accessToken

    let accessToken = ''
    let refreshToken = ''

    it ("should login user", async () => {
        const data =
            {   password: "qwerty1",
                loginOrEmail: "login1"
            }

        const createResponse = await request(app)
            .post("/auth/login")
            .send(data)
            .expect(200);

        accessToken = createResponse.body.accessToken;
        refreshToken = createResponse.headers["set-cookie"][0];
    });

    it ("should get info about user", async () => {
        const createResponse = await request(app)
            .get("/auth/me")
            .set('Cookie', refreshToken)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200, {
                userId: createdUser1.id,
                login: "login1",
                email: "rimskayama@outlook.com"
            })
    });

    it ("should return new refresh and access tokens", async () => {

        const createResponse = await request(app)
            .post("/auth/refresh-token")
            .set('Cookie', refreshToken)
            .expect(200);

        refreshToken = createResponse.headers["set-cookie"][0];
        accessToken = createResponse.body.accessToken

        const b = await request(app).get("/auth/me")
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)


    });

    it ("should logout user", async () => {
        const createResponse = await request(app)
            .post("/auth/logout")
            .set('Cookie', refreshToken)
            .expect(204);

        const b = await request(app).get("/auth/me")
            .set('Cookie', refreshToken)
            .expect(401)

    });

    //registration

    it ("should register the user", async () => {
        const data =
            {   password: "qwerty",
                email: "aa22@outlook.com",
                login: "login"
            }
        const createResponse = await request(app)
            .post("/auth/registration/")
            .send(data)
            .expect(204)
    });

    it ("should not let user register if user with email that already exists", async () => {
        const data =
            {   password: "qwerty1",
                email: "rimskayama@outlook.com",
                login: "login1"
            }
        const createResponse = await request(app)
            .post("/auth/registration/")
            .send(data)
            .expect(400, {
                errorsMessages: [
                    { message: 'User with that email already exists', field: 'email' },
                    { message: 'User with that login already exists', field: 'login' }
                ]
            })
    });

    it ("should send confirmation mail", async () => {
        const data = {
            "email": "aa22@outlook.com"
        }
        const createResponse = await request(app)
            .post("/auth/registration-email-resending")
            .send(data)
            .expect(204)

    })

    it ("should not let user resend mail if email is already confirmed", async () => {
        const data = {
            "email":  "rimskayama@outlook.com"
        }
        const createResponse = await request(app)
            .post("/auth/registration-email-resending")
            .send(data)
            .expect(400, {
                "errorsMessages": [
                    {
                        "message": "Your email was already confirmed",
                        "field": "email"
                    }
                ]
            })

    })
});