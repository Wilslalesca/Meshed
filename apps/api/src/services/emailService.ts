import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = {

    async sendEmailInvite(email: string, code: string, teamName: string) {
        await resend.emails.send({
            from: "UMA Team <onboarding@resend.dev>",
            to: email,
            subject: `You're invited to join the team "${teamName}" on UMA`,
            html: `<p>Use the following link to join the team:</p><a href="https://uma.com/join?code=${code}">Join ${teamName}</a>`,
        });
    },

    async sendVerificationEmail(email: string , code: string) {
        await resend.emails.send({
            from: "UMA Team <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email for UMA",
            html: `<p>Your verification code is: <strong>${code}</strong></p>`,
        });
    },

    async sendPasswordResetEmail(email: string, code: string) {
        await resend.emails.send({
            from: "UMA Team <onboarding@resend.dev>",
            to: email,
            subject: "Reset your UMA password",
            html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
        });
    },
}