import request from "supertest";
import {app} from "../src/app-config";

//ERR 429

describe('rate-limiter', () => {

    it('should NOT register user, /auth/registration', async() => {
        const data =
            {   password: "qwerty",
                email: "blabla",
                login: "login"
            }
        //1
        await request(app)
            .post("/auth/registration")
            .send(data)
            .expect(400);
        //2
        await request(app)
            .post("/auth/registration")
            .send(data)
            .expect(400);
        //3
        await request(app)
            .post("/auth/registration")
            .send(data)
            .expect(400);
        //4
        await request(app)
            .post("/auth/registration")
            .send(data)
            .expect(400);
        //5
        await request(app)
            .post("/auth/registration")
            .send(data)
            .expect(400);
        //6
        await request(app)
            .post("/auth/registration")
            .send(data)
            .expect(429);
    });

    it('should NOT accept confirmation code, /auth/registration-confirmation', async() => {
        const data =
            {
                code: "code"
            }
        //1
        await request(app)
            .post("/auth/registration-confirmation")
            .send(data)
            .expect(400);
        //2
        await request(app)
            .post("/auth/registration-confirmation")
            .send(data)
            .expect(400);
        //3
        await request(app)
            .post("/auth/registration-confirmation")
            .send(data)
            .expect(400);
        //4
        await request(app)
            .post("/auth/registration-confirmation")
            .send(data)
            .expect(400);
        //5
        await request(app)
            .post("/auth/registration-confirmation")
            .send(data)
            .expect(400);
        //6
        await request(app)
            .post("/auth/registration-confirmation")
            .send(data)
            .expect(429);
    });

    it('should NOT send email, /auth/registration-email-resending', async () => {
    //1
    await request(app)
        .post("/auth/registration-email-resending")
        .send({email: 'blabla'})
        .expect(400);
    //2
    await request(app)
        .post("/auth/registration-email-resending")
        .send({email: 'blabla'})
        .expect(400);
    //3
    await request(app)
        .post("/auth/registration-email-resending")
        .send({email: 'blabla'})
        .expect(400);
    //4
    await request(app)
        .post("/auth/registration-email-resending")
        .send({email: 'blabla'})
        .expect(400);
    //5
    await request(app)
        .post("/auth/registration-email-resending")
        .send({email: 'blabla'})
        .expect(400);
    //6
    await request(app)
        .post("/auth/registration-email-resending")
        .send({email: 'blabla'})
        .expect(429);
});

    it ("should NOT login not existing user, /auth/login", async () => {
        const data =
            {   password: "qwerty5",
                loginOrEmail: "login5"
            }

        //1
        await request(app)
            .post("/auth/login")
            .send(data)
            .expect(401);
        //2
        await request(app)
            .post("/auth/login")
            .send(data)
            .expect(401);
        //3
        await request(app)
            .post("/auth/login")
            .send(data)
            .expect(401);
        //4
        await request(app)
            .post("/auth/login")
            .send(data)
            .expect(401);
        //5
        await request(app)
            .post("/auth/login")
            .send(data)
            .expect(401);
        //6
        await request(app)
            .post("/auth/login")
            .send(data)
            .expect(429);
    });

})