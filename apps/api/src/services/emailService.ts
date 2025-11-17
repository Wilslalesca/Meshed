import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API!);

export const EmailService = {
    async sendInviteEmail(email: string, code: string, teamName: string) {
        await resend.emails.send({
            from: "UMA Team <no-reply@umateam.com>",
            to: email,
            subject: `You're invited to join the ${teamName} team!`,
            html: `<p>Use the following code to join the team: <strong>${code}</strong></p>`
        });
    },

    async sendEmailVerification(email: string, code: string) {
        await resend.emails.send({
            from: "UMA Team <no-reply@umateam.com>",
            to: email,
            subject: `Verify your email address`,
            html: `<p>Your verification code is: <strong>${code}</strong></p>`
        });
    },

    async sendPasswordReset(email: string, code: string) {
        await resend.emails.send({
            from: "UMA Team <no-reply@umateam.com>",
            to: email,
            subject: "Reset Your Password",
            html: `<p>Your password reset code is <strong>${code}</strong></p>`
        });
    }
};
