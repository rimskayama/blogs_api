import { emailAdapter } from "../adapters/email-adapter";

export const emailManager = {

    async sendEmail(email: string) {

        const subject = "confirmation message";
        const html = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
    <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
</p>`
        await emailAdapter.sendEmail(email, subject, html);
    },
}