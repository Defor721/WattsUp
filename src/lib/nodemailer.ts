import nodemailer from "nodemailer";

interface sendEmailProps {
  email: string;
  subject: string;
  text: string;
}

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PW,
  },
});

export async function sendEmail({ email, subject, text }: sendEmailProps) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    text: text,
  });
}
