import { Resend } from "resend";
import { config } from "../config/config";
const BASE_URL = config.frontendOrigin;
const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

export const sendEmail = {

    async sendEmailInvite(email: string, teamName: string, token: string) {
        if (!resend) {
            console.warn("Email disabled: missing RESEND_API_KEY");
            return;
        }
        await resend.emails.send({
            from: "Meshed Team <onboarding@resend.dev>",
            to: email,
            subject: `Complete your Meshed account to join ${teamName}`,
            html: `
            <p>You’ve been added to <strong>${teamName}</strong> on Meshed.</p>
            <p>Create your account to access the team:</p>
            <p><a href="${BASE_URL}/register/invite?invite=${token}">
                Complete Your Account
            </a></p>
            `
        });
    },

    async sendVerificationEmail(email: string , code: string) {
        if (!resend) {
            console.warn("Email disabled: missing RESEND_API_KEY");
            return;
        }
        await resend.emails.send({
            from: "Meshed Team <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email for Meshed",
            html: `<p>Your verification code is: <strong>${code}</strong></p>`,
        });
    },

    async sendPasswordResetEmail(email: string, code: string) {
        if (!resend) {
            console.warn("Email disabled: missing RESEND_API_KEY");
            return;
        }
        await resend.emails.send({
            from: "Meshed Team <onboarding@resend.dev>",
            to: email,
            subject: "Reset your Meshed password",
            html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
        });
    },

    async sendAddedToTeamEmail(email: string, teamName: string, role: string) {
    if (!resend) {
        console.warn("Email disabled: missing RESEND_API_KEY");
        return;
    }
    await resend.emails.send({
        from: "Meshed Team <onboarding@resend.dev>",
        to: email,
        subject: `You've been added to ${teamName}`,
        html: `
            <p>You have been added to the team <strong>${teamName}</strong> on Meshed.</p>
            <p>Your role: <strong>${role}</strong></p>
            <p>Log in to view your team: <a href="${BASE_URL}/login">Meshed Login</a></p>
        `,
    });
},

    async sendScheduleUpdatedEmail(email: string, courseName: string) {
        if (!resend) {
            console.warn("Email disabled: missing RESEND_API_KEY");
            return;
        }
        await resend.emails.send({
            from: "Meshed Team <onboarding@resend.dev>",
            to: email,
            subject: `Schedule updated: ${courseName}`,
            html: `
                <p>Your schedule item <strong>${courseName}</strong> was updated.</p>
                <p>Log in to view changes: <a href="${BASE_URL}/login">Meshed Login</a></p>
            `,
        });
    },

}