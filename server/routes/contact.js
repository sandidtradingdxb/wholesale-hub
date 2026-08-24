const express = require("express");
const { body, validationResult } = require("express-validator");
const { sendNotification } = require("../utils/mailer");

const router = express.Router();

// POST /api/contact — public contact form submission, emails the site owner
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
    body("email").optional({ checkFalsy: true }).isEmail().withMessage("Email must be valid"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, company, email, phone, message } = req.body;

    await sendNotification({
      subject: `New contact form inquiry — ${name}`,
      html: `
        <h2>New contact form inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br/>")}</p>
      `,
      text: `New contact form inquiry\n\nName: ${name}\nCompany: ${company || "-"}\nEmail: ${email || "-"}\nPhone: ${phone || "-"}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ message: "Thanks — your message has been sent. We'll be in touch soon." });
  }
);

module.exports = router;
