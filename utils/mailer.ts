import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `https://your-frontend-domain.com/reset-password?token=${token}`; // Update as needed

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <p>You requested to reset your password.</p>
      <p>Click the link below to proceed:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
