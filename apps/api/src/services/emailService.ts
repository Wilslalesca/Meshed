import nodemailer from "nodemailer";
import { config } from "../config/config";

const BASE_URL = config.frontendOrigin;

function buildTransport() {
  if (config.nodeEnv === "test") {
    // Avoid network calls in unit tests.
    return nodemailer.createTransport({ jsonTransport: true });
  }

  const smtpHost = config.smtpHost;
  const smtpPort = config.smtpPort;
  const smtpSecure = config.smtpSecure;
  const smtpUser = config.smtpUser;
  const smtpPass = config.smtpPass;

  const host = smtpHost;
  const port = smtpPort;
  const secure = smtpSecure ?? false;

  const user = smtpUser;
  const pass = smtpPass;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

const transporter = buildTransport();
const mailFrom =
  config.mailFrom ??
  config.smtpUser ??
  (config.nodeEnv === "test" ? "test@example.com" : undefined);

export const mail = {
  async sendEmail(to: string, subject: string, html: string) {
    if (!mailFrom) {
      throw new Error("MAIL_FROM is not configured.");
    }

    if (!transporter) {
      if (config.nodeEnv !== "production") {
        console.log("[DEV EMAIL]", { to, subject, html });
        return { messageId: "dev-email", accepted: [to], rejected: [] };
      }

      throw new Error(
        "Email is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (and optionally MAIL_FROM)."
      );
    }

    const info = await transporter.sendMail({
      from: `"Meshed" <${mailFrom}>`,
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
