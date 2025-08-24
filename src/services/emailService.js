const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/apiError");

/**
 * Email service for sending various types of emails
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password (not Gmail password)
      },
    });

    // Verify SMTP connection on startup
    this.transporter.verify((err, success) => {
      if (err) {
        console.error("SMTP connection failed:", err);
      } else {
        console.log("✅ SMTP Server is ready to send emails");
      }
    });
  }

  /**
   * Send contact form emails (admin notification + auto-reply)
   * @param {Object} contactData - Contact form data
   * @returns {Promise<void>}
   */
  async sendContactEmails(contactData) {
    const { name, email, phone, subject, message } = contactData;

    // Resolve banner path (check both src/assets and root/assets)
    let bannerPath = path.join(__dirname, "../assets/banner.png");
    if (!fs.existsSync(bannerPath)) {
      bannerPath = path.join(__dirname, "../../assets/banner.png");
    }

    // Email to admin (notification)
    const adminMailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // must use your Gmail
      replyTo: email, // user’s email shows up when you reply
      to: process.env.EMAIL_TO,
      subject: `📬 ${subject}`,
      html: this.generateAdminEmailTemplate(
        name,
        email,
        phone,
        subject,
        message
      ),
    };

    // Auto-reply email
    const autoReplyOptions = {
      from: `"Accelrix Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "📬 We've received your message – Accelrix",
      html: this.generateAutoReplyTemplate(name),
      attachments: bannerPath
        ? [
            {
              filename: "banner.png",
              path: bannerPath,
              cid: "accelrixbanner",
            },
          ]
        : [],
    };

    try {
      await Promise.all([
        this.transporter.sendMail(adminMailOptions),
        this.transporter.sendMail(autoReplyOptions),
      ]);
      console.log("✅ Emails sent successfully");
    } catch (error) {
      console.error("❌ Email sending error details:", {
        message: error.message,
        code: error.code,
        response: error.response,
      });
      throw new ApiError(500, "Failed to send emails");
    }
  }

  /**
   * Generate admin email template
   * @private
   */
  generateAdminEmailTemplate(name, email, phone, subject, message) {
    return `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
  }

  /**
   * Generate auto-reply email template
   * @private
   */
  generateAutoReplyTemplate(name) {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; background-color: #f9f9f9; padding: 10px 15px;">
        <table role="presentation" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="text-align: center; border-radius: 8px 8px 0 0;">
              <img src="cid:accelrixbanner" alt="Accelrix Banner" width="100%" style="max-width: 600px; border-radius: 8px 8px 0 0;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 25px 30px;">
              <h2 style="color: #007FFF;">Hi ${name},</h2>
              <p style="font-size: 16px;">Thank you for reaching out to <strong>Accelrix</strong>! 🎉<br />
              We've received your message and our team will get back to you as soon as possible. You can typically expect a response within 24–48 hours.</p>
              <a href="https://accelrix-buildbeyond.web.app" target="_blank" style="display: inline-block; background-color: #007FFF; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px;">Visit Accelrix Website</a>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 14px; color: #777;">This is an automated response confirming that we've received your message. Our support team will reach out shortly.</p>
              <p style="font-size: 14px; color: #999; margin-top: 40px;">— The Accelrix Team</p>
            </td>
          </tr>
        </table>
      </div>
    `;
  }
}

module.exports = new EmailService();
