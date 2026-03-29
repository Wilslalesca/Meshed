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

  const gmailUser = config.gmailAppEmail;
  const gmailPass = config.gmailAppPassword;

  const host = smtpHost;
  const port = smtpPort;
  const secure = smtpSecure ?? false;

  const user = smtpUser;
  const pass = smtpPass;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  // Local/dev convenience: support Gmail app passwords without SMTP_* env vars.
  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
    });
  }

  return null;
}

const transporter = buildTransport();
const mailFrom =
  config.mailFrom ??
  config.gmailAppEmail ??
  config.smtpUser ??
  (config.nodeEnv === "test"
    ? "test@example.com"
    : config.nodeEnv !== "production"
      ? "dev@meshed.local"
      : undefined);

export const mail = {
  async sendEmail(to: string, subject: string, html: string) {
    if (!transporter) {
      if (config.nodeEnv !== "production") {
        console.log("[DEV EMAIL]", { from: mailFrom, to, subject, html });
        return { messageId: "dev-email", accepted: [to], rejected: [] };
      }

      throw new Error(
        "Email is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (and optionally MAIL_FROM)."
      );
    }

    if (!mailFrom) {
      throw new Error("MAIL_FROM is not configured.");
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
  async sendOrganizationInviteEmail(email: string, organizationId: string, token: string) {
    return mail.sendEmail(
      email,
      `Complete your Meshed account to join your organization`,
      `
        <p>You’ve been invited to join an organization on Meshed.</p>
        <p>Create your account to access the organization:</p>
        <p>
          <a href="${BASE_URL}/register/invite?invite=${token}">
            Complete Your Account
          </a>
        </p>
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

  async sendBookingConfirmationEmail(email: string, facilityName: string, userRequested: string, eventName: string, type: string, startDate: string, endDate: string, startTime: string, endTime: string, notes?: string | null) {
    return mail.sendEmail(
      email,
      `A New Booking Request for ${facilityName} has been made`,
      `
        <p>A new booking request has been made in Meshed</p>
        <p><strong>Requested by:</strong> ${userRequested || "A manager at your organization"}</p>
        <p><strong>Event name:</strong> ${eventName || "N/A"}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Date:</strong> ${startDate}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Notes:</strong> ${notes || "None provided"}</p>

        <p>
          <a href="${BASE_URL}/dashboard">
            Review booking request
          </a>
        </p>
      `
    );
  },

  async sendBookingStatusEmail(email: string, facilityName: string, eventName: string, startDate: string, startTime: string, endTime: string, status: string, comments?: string | null) {
    const normalizedStatus = status.toUpperCase();
    const subject = normalizedStatus === "APPROVED" ? "Your booking request was approved" : "Your booking request was denied";
    return mail.sendEmail(
      email,
      subject,
      `
        <p><strong>Facility:</strong> ${facilityName}</p>
        <p><strong>Event name:</strong> ${eventName || "N/A"}</p>
        <p><strong>Date:</strong> ${startDate}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Manager comments:</strong> ${comments || "None provided"}</p>

        <p>
          <a href="${BASE_URL}/teams">
            View your bookings
          </a>
        </p>
      `
    );
  }
};
