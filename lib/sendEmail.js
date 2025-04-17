import nodemailer from "nodemailer";

export default async function sendEmail({ to, subject, text, html }) {
  // Check if required environment variables are set
  const isDev = process.env.NODE_ENV === "development";
  let testAccount, transporter;

  try {
    if (isDev && !process.env.EMAIL_USER) {
      console.log("Creating test email account for development");
      testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      // Production transporter using environment variables
      console.log("Creating email transporter with:", {
        host: process.env.EMAIL_HOST,
        port: Number.parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number.parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          // Do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });
    }

    // Verify connection configuration
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // Send the email
    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        '"Medicare Appointment System" <teammedicare777@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully:", info.messageId);

    // Log URL for development testing
    if (isDev && testAccount) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
