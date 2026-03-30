import { Request, Response } from "express";
import { mail } from "../services/emailService";

const CONTACT_EMAIL = "unitematchalign@gmail.com";

export class ContactController {
  static async handleContactForm(req: Request, res: Response) {
    const { name, email, role, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }

    try {
      await mail.sendEmail(
        CONTACT_EMAIL,
        `Meshed inquiry from ${name}`,
        `
          <h2>New contact form submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Role:</strong> ${role || "Not specified"}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        `
      );

      // Send a confirmation back to the person who submitted
      await mail.sendEmail(
        email,
        "We got your message — Meshed",
        `
          <p>Hi ${name},</p>
          <p>Thanks for reaching out! We'll be in touch shortly.</p>
          <p>— The Meshed team</p>
        `
      );

      return res.json({ success: true });
    } catch (err) {
      console.error("Contact form email error:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }
  }
}