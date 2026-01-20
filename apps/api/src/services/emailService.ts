import nodemailer from "nodemailer";

const BASE_URL = process.env.FRONTEND_ORIGIN!;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!;
const GMAIL_APP_EMAIL = process.env.GMAIL_APP_EMAIL!;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_APP_EMAIL,
    pass: GMAIL_APP_PASSWORD,
  },
});

export const mail = {
  async sendEmail(to: string, subject: string, html: string) {
    const info = await transporter.sendMail({
      from: `"Meshed" <${GMAIL_APP_EMAIL}>`,
      to,
      subject,
      html,
    });

    return info; 
  },
};

export const sendEmail = {
  async sendEmailInvite(email: string, teamName: string, token: string) {
    return mail.sendEmail(
      email,
      `Complete your Meshed account to join ${teamName}`,
      `
        <p>You’ve been added to <strong>${teamName}</strong> on Meshed.</p>
        <p>Create your account to access the team:</p>
        <p><a href="${BASE_URL}/register/invite?invite=${token}">
          Complete Your Account
        </a></p>
      `
    );
  },

  async sendVerificationEmail(email: string, code: string) {
    return mail.sendEmail(
      email,
      "Verify your email for Meshed",
      `<p>Your verification code is: <strong>${code}</strong></p>`
    );
  },

  async sendPasswordResetEmail(email: string, code: string) {
    return mail.sendEmail(
      email,
      "Reset your Meshed password",
      `<p>Your password reset code is: <strong>${code}</strong></p>`
    );
  },

  async sendAddedToTeamEmail(email: string, teamName: string, role: string) {
    return mail.sendEmail(
      email,
      `You've been added to ${teamName}`,
      `
        <p>You have been added to the team <strong>${teamName}</strong> on Meshed.</p>
        <p>Your role: <strong>${role}</strong></p>
        <p>Log in to view your team: <a href="${BASE_URL}/login">Meshed Login</a></p>
      `
    );
  },
};
