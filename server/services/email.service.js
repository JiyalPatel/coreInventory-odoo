const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const sendOtpEmail = async ({ to, otp }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"CoreInventory" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your CoreInventory Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #1e3a5f; border-radius: 8px; margin-bottom: 12px;">
            <span style="color: white; font-size: 22px;">📦</span>
          </div>
          <h1 style="margin: 0; font-size: 22px; color: #111827;">CoreInventory</h1>
        </div>

        <h2 style="font-size: 18px; color: #111827; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
          Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.
        </p>

        <div style="text-align: center; background: #f3f4f6; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #1e3a5f;">${otp}</span>
        </div>

        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          If you did not request a password reset, you can safely ignore this email.
          Your password will not change.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
