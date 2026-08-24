const nodemailer = require("nodemailer");

// Sends notification emails to the store owner's inbox using Gmail SMTP.
// Requires two env vars (set in Render, not committed to git):
//   NOTIFY_EMAIL_USER = the Gmail address emails are sent FROM (can be the same as ADMIN_EMAIL)
//   NOTIFY_EMAIL_APP_PASSWORD = a 16-character Gmail "App Password" (NOT your normal Gmail password)
// The recipient (where notifications land) is process.env.ADMIN_EMAIL.
//
// How to get a Gmail App Password:
//   1. On the Gmail account that will SEND the emails, turn on 2-Step Verification
//      (myaccount.google.com/security)
//   2. Go to myaccount.google.com/apppasswords
//   3. Create a new app password (name it e.g. "Trinity Plus Trading site")
//   4. Copy the 16-character password shown and use it as NOTIFY_EMAIL_APP_PASSWORD

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.NOTIFY_EMAIL_USER || !process.env.NOTIFY_EMAIL_APP_PASSWORD) {
    console.warn(
      "Email notifications are not configured (missing NOTIFY_EMAIL_USER / NOTIFY_EMAIL_APP_PASSWORD). Skipping email send."
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NOTIFY_EMAIL_USER,
      pass: process.env.NOTIFY_EMAIL_APP_PASSWORD,
    },
  });

  return transporter;
}

/**
 * Send a plain-text/HTML notification email to the site owner's inbox.
 * Never throws — logs and swallows errors so a failed email never breaks
 * the API request that triggered it (contact form, registration, etc.)
 */
async function sendNotification({ subject, html, text }) {
  const t = getTransporter();
  const to = process.env.ADMIN_EMAIL;

  if (!t || !to) {
    console.warn(`Email not sent (transporter or ADMIN_EMAIL missing). Subject: ${subject}`);
    return;
  }

  try {
    await t.sendMail({
      from: `"${process.env.NOTIFY_FROM_NAME || "Website Notifications"}" <${process.env.NOTIFY_EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("Failed to send notification email:", err.message);
  }
}

module.exports = { sendNotification };
