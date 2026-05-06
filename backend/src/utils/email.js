const { smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom } = require("../config/env");

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;
  try {
    const nodemailer = require("nodemailer");
    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
    }
  } catch {
    // nodemailer not installed — fall through to console logging
  }
  return transporter;
}

async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const t = await getTransporter();

  if (!t) {
    // Development fallback: log the link so devs can test without SMTP
    console.log("\n========================================");
    console.log("PASSWORD RESET LINK (dev — no SMTP configured)");
    console.log(`To: ${to}`);
    console.log(`Link: ${resetUrl}`);
    console.log("Expires in: 1 hour");
    console.log("========================================\n");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:40px 0;">
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,.1);">
          <h1 style="color:#0e7490;font-size:24px;margin:0 0 8px;">MedAssist</h1>
          <p style="color:#64748b;margin:0 0 32px;font-size:14px;">Healthcare Platform</p>
          <h2 style="color:#1e293b;font-size:20px;margin:0 0 12px;">Reset your password</h2>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Hi ${name}, we received a request to reset the password for your MedAssist account.
            Click the button below to choose a new password.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#0e7490;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:13px;margin:24px 0 0;line-height:1.6;">
            This link expires in <strong>1 hour</strong>. If you didn't request a password reset,
            you can safely ignore this email — your password won't change.
          </p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="color:#cbd5e1;font-size:12px;margin:0;">
            If the button doesn't work, paste this URL into your browser:<br/>
            <span style="color:#0e7490;">${resetUrl}</span>
          </p>
        </div>
      </body>
    </html>
  `;

  await t.sendMail({
    from: smtpFrom || `"MedAssist" <${smtpUser}>`,
    to,
    subject: "Reset your MedAssist password",
    html,
  });
}

module.exports = { sendPasswordResetEmail };
