import nodemailer from "nodemailer"
export const emailAdapter = {

async sendEmail(email: string, subject: string, html: string) {

    const authEmail = process.env.EMAIL;
    const authPass = process.env.PASS;

            let transport = await nodemailer.createTransport({
                    service: "gmail",
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
        return info

},

    async resendEmail(email: string, subject: string, html: string) {

        const authEmail = process.env.EMAIL;
        const authPass = process.env.PASS;

        let transport = await nodemailer.createTransport({
            service: "gmail",
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

        return info


}}