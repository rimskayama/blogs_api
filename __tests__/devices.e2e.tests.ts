import request from "supertest";
import {app} from "../src/app-config";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

describe("/security/devices", () => {
    const mongoURI = process.env.MONGO_URL|| 'mongodb://0.0.0.0:27017/blogs_api'

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
        await request(app).delete("/testing/all-data");
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    let createdUser1: any = {id: 0};
    it("should create user for devices testing", async () => {
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
                        email: "rimskayama@outlook.com",
                        createdAt: expect.any(String)
                    }
                ]
            }
        )
    });

    let accessToken = ''
    let refreshTokenOfSession1 = ''
    let refreshTokenOfSession3 = ''

    it("should login user: 1 session, Chrome", async () => {
        const data =
            {
                password: "qwerty1",
                loginOrEmail: "login1"
            }

        const createResponse = await request(app)
            .post("/auth/login")
            .set('user-agent', "Chrome")
            .send(data)
            .expect(200);

        accessToken = createResponse.body.accessToken;
        refreshTokenOfSession1 = createResponse.headers["set-cookie"][0];
    });

    it("should login user: 2 session, Android", async () => {
        const data =
            {
                password: "qwerty1",
                loginOrEmail: "login1"
            }

        const createResponse = await request(app)
            .post("/auth/login")
            .set('user-agent', "Android")
            .send(data)
            .expect(200);

    });

    it("should login user: 3 session, Firefox", async () => {
        const data =
            {
                password: "qwerty1",
                loginOrEmail: "login1"
            }

        const createResponse = await request(app)
            .post("/auth/login")
            .set('user-agent', "Firefox")
            .send(data)
            .expect(200);

        refreshTokenOfSession3 = createResponse.headers["set-cookie"][0];

    });

    it("should login user: 4 session, iPhone", async () => {
        const data =
            {
                password: "qwerty1",
                loginOrEmail: "login1"
            }

        const createResponse = await request(app)
            .post("/auth/login")
            .set('user-agent', "iPhone")
            .send(data)
            .expect(200);

    });

    let deviceIdOfUser1 = ''
    let lastActiveDateOfUser1 = ''
    it("should return all sessions of user №1", async () => {
        const createResponse = await request(app)
            .get("/security/devices")
            .set('Cookie', refreshTokenOfSession1)
            .expect(200)

        expect(createResponse.body).toEqual([{
            ip: expect.any(String),
            title: 'Chrome',
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String),
        },
            {
                ip: expect.any(String),
                title: 'Android',
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
            {
                ip: expect.any(String),
                title: 'Firefox',
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
            {
                ip: expect.any(String),
                title: 'iPhone',
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            }
        ])
        deviceIdOfUser1 = createResponse.body[1].deviceId
        lastActiveDateOfUser1 = createResponse.body[0].lastActiveDate
    });

//ERR 404
    it("should NOT delete session, err 404", async () => {
        await request(app)
            .delete("/security/devices/" + 'somewrongdeviceid')
            .set('Cookie', refreshTokenOfSession1)
            .expect(404);

    })

//ERR 403

    let accessTokenOfUser2 = ''
    let refreshTokenOfUser2 = ''
    let createdUser2: any = {id: 0};
    let deviceIdOfUser2 = ''
    it("should create user №2 for error 403 testing", async () => {
        const data =
            {
                password: "qwerty2",
                email: "emailofnewuser@outlook.com",
                login: "login2"
            }

        const createResponse = await request(app)
            .post("/users")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(201);

        createdUser2 = createResponse.body;
    });

    it("should login user №2 for testing", async () => {
        const data =
            {
                password: "qwerty2",
                loginOrEmail: "login2"
            }

        const createResponse = await request(app)
            .post("/auth/login")
            .set('user-agent', "iPhone")
            .send(data)
            .expect(200);

        accessTokenOfUser2 = createResponse.body.accessToken;
        refreshTokenOfUser2 = createResponse.headers["set-cookie"][0];
    });

    it("should return all sessions of user №2 to get deviceId", async () => {
        const createResponse = await request(app)
            .get("/security/devices")
            .set('Cookie', refreshTokenOfUser2)
            .expect(200)

        expect(createResponse.body).toEqual([{
            ip: expect.any(String),
            title: 'iPhone',
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String),
        }
        ])

        deviceIdOfUser2 = createResponse.body[0].deviceId
    });

    it("should NOT delete session, err 403: deviceId of user №2, refreshToken of user №1",
        async () => {
            await request(app)
                .delete("/security/devices/" + deviceIdOfUser2)
                .set('Cookie', refreshTokenOfSession1)
                .expect(403);
        }),

        it("should NOT delete session, err 401",
            async () => {
                await request(app)
                    .delete("/security/devices/" + deviceIdOfUser2)
                    .expect(401);
            }),

        it("should return new refresh of user 1, session 1 Chrome", async () => {

            const createResponse = await request(app)
                .post("/auth/refresh-token")
                .set('Cookie', refreshTokenOfSession1)
                .expect(200);

            refreshTokenOfSession1 = createResponse.headers["set-cookie"][0];

        });


    it("should return all sessions of user №1 with changed session 1.lastActiveDate)", async () => {
        const createResponse = await request(app)
            .get("/security/devices")
            .set('Cookie', refreshTokenOfSession1)
            .expect(200)
        expect(createResponse.body[0].lastActiveDate).not.toEqual(lastActiveDateOfUser1)

    })

    it("should delete session 2, refreshToken of session 1",
        async () => {
            await request(app)
                .delete("/security/devices/" + deviceIdOfUser1)
                .set('Cookie', refreshTokenOfSession1)
                .expect(204);

            const b = await request(app)
                .get("/security/devices")
                .set('Cookie', refreshTokenOfSession1)
                .expect(200)

            expect(b.body).toEqual([
                {
                    ip: expect.any(String),
                    title: 'Chrome',
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                },
                {
                    ip: expect.any(String),
                    title: 'Firefox',
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                },
                {
                    ip: expect.any(String),
                    title: 'iPhone',
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                }
            ])
        })

    it("should logout user", async () => {
        const createResponse = await request(app)
            .post("/auth/logout")
            .set('Cookie', refreshTokenOfSession3)
            .expect(204);

        const b = await request(app)
            .get("/security/devices")
            .set('Cookie', refreshTokenOfSession1)
            .expect(200)

        expect(b.body).toEqual([
            {
                ip: expect.any(String),
                title: 'Chrome',
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            },
            {
                ip: expect.any(String),
                title: 'iPhone',
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String),
            }
        ])
    })

    it("should delete others sessions except Chrome, refreshToken of session 1",
        async () => {
            await request(app)
                .delete("/security/devices/")
                .set('Cookie', refreshTokenOfSession1)
                .expect(204);

            const b = await request(app)
                .get("/security/devices")
                .set('Cookie', refreshTokenOfSession1)
                .expect(200)

            expect(b.body).toEqual([
                {
                    ip: expect.any(String),
                    title: 'Chrome',
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                }
            ])
        })
})