import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:8080/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Citizen Voice" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: #030340; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Citizen Voice</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #030340; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.5;">
            You have requested to reset your password. Please click the button below to proceed:
          </p>
          <div style="text-align: center; cursor:pointer; margin: 20px 0;">
            <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #030340; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold;">
              Reset Your Password
            </a>
            </div>
          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            For support, contact us at <a href="mailto:support@citizenvoice.com" style="color: #030340; text-decoration: underline;">support@citizenvoice.com</a>.
          </p>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Citizen Voice. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
