import { Resend } from "resend";
const BASE_URL = process.env.FRONTEND_ORIGIN!;
const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = {

    async sendEmailInvite(email: string, teamName: string, token: string) {
        await resend.emails.send({
            from: "UMA Team <onboarding@resend.dev>",
            to: email,
            subject: `Complete your UMA account to join ${teamName}`,
            html: `
            <p>You’ve been added to <strong>${teamName}</strong> on UMA.</p>
            <p>Create your account to access the team:</p>
            <p><a href="${BASE_URL}/register/invite?invite=${token}">
                Complete Your Account
            </a></p>
            `
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

    async sendAddedToTeamEmail(email: string, teamName: string, role: string) {
    await resend.emails.send({
        from: "UMA Team <onboarding@resend.dev>",
        to: email,
        subject: `You've been added to ${teamName}`,
        html: `
            <p>You have been added to the team <strong>${teamName}</strong> on UMA.</p>
            <p>Your role: <strong>${role}</strong></p>
            <p>Log in to view your team: <a href="${BASE_URL}/login">UMA Login</a></p>
        `,
    });
},

}