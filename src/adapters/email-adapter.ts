import nodemailer from "nodemailer"
export const emailAdapter = {

async sendEmail(email: string, subject: string, html: string) {

    const authEmail = process.env.EMAIL;
    const authPass = process.env.PASS;

            let transport = await nodemailer.createTransport({
                    service: "outlook",
                    auth: {
                        user: authEmail,
                        pass: authPass
                    }
                });

    let info = await transport.sendMail({
        from: authEmail,
        to: email,
        subject: subject,
        html: html
    });
    console.log(info)
        return info

}}