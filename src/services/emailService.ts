import transporter from "@/lib/nodemailer";

interface sendVerificationEmailProps {
  email: string;
  subject: string;
  text: string;
}

export async function sendVerificationEmail({
  email,
  subject,
  text,
}: sendVerificationEmailProps) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    text: text,
  });
}
