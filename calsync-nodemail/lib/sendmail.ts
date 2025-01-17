'use server';
import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  // Remove the 'service' option as it's specific to Gmail
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: false, // Posteo uses STARTTLS, so set secure to false
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    // Before sending an email, this step verifies the SMTP connection 
    // considered good practice
    const isVerified = await transporter.verify();
    if (!isVerified) {
      console.error('Failed to verify SMTP connection');
      return { success: false, message: 'Failed to verify SMTP connection' };
    }
  } catch (error) {
    console.error('Error while verifying SMTP connection', error);
    return { success: false, message: 'Error while verifying SMTP connection' };
  }
  try {
  const info = await transporter.sendMail({
    from: SMTP_SERVER_USERNAME, 
    to: sendTo || SITE_MAIL_RECIEVER,
    subject: subject,
    text: text,
    html: html ? html : '',
    replyTo: email, // Set the contacting user's email in the replyTo field
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', SITE_MAIL_RECIEVER);
  // Return the info object with the messageId
  return { success: true, messageId: info.messageId }; // Include a success field
} catch (error) {
  if (error instanceof Error) {
    console.error('Error while sending email:', error);
    return { success: false, message: error.message }; // Now safe to access message
  } else {
    console.error('Error while sending email:', error);
    return { success: false, message: 'An unknown error occurred.' }; // Fallback message for unknown errors
  }
}
}
