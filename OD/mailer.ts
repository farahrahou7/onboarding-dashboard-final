import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "outlook", // of "outlook", of "smtp"
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `https://onboarding-dashboard-final-o8hg.onrender.com/api/auth/verify/${token}`;
  await transporter.sendMail({
    from: `"Onboarding Dashboard" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Bevestig je account",
    html: `
      <p>Hallo!</p>
      <p>Bedankt voor je registratie. Klik op onderstaande link om je e-mailadres te bevestigen:</p>
      <a href="${url}">${url}</a>
      <p>Groetjes,<br>Corporate Onboarding Team</p>
    `,
  });
};
