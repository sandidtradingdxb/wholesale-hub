// Sends notification emails to the store owner's inbox using Resend
// (https://resend.com) over plain HTTPS — this avoids Render's free-tier
// block on outbound SMTP connections (ports 587/465), which caused Gmail
// SMTP to time out.
//
// Setup:
//   1. Sign up at resend.com using the ADMIN_EMAIL address (or any email
//      you control) — no credit card required.
//   2. Go to resend.com/api-keys and create a new API key.
//   3. Set RESEND_API_KEY in Render's environment variables to that key.
//
// Without verifying a custom sending domain, Resend only allows sending
// FROM "onboarding@resend.dev" TO the email address you signed up with.
// That's exactly this use case (notifications land in ADMIN_EMAIL), so no
// domain setup is required. If you later want emails to say "@trinity-plus-
// trading.com" instead, verify that domain in Resend's dashboard and change
// RESEND_FROM_EMAIL below.

const RESEND_API_URL = "https://api.resend.com/emails";

/**
 * Send a plain-text/HTML notification email to the site owner's inbox.
 * Never throws — logs and swallows errors so a failed email never breaks
 * the API request that triggered it (contact form, registration, etc.)
 */
async function sendNotification({ subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.NOTIFY_FROM_NAME || "Website Notifications";

  if (!apiKey || !to) {
    console.warn(`Email not sent (RESEND_API_KEY or ADMIN_EMAIL missing). Subject: ${subject}`);
    return;
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${from}>`,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`Resend API error (${res.status}): ${body}`);
    }
  } catch (err) {
    console.error("Failed to send notification email:", err.message);
  }
}

module.exports = { sendNotification };
