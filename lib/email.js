// lib/email.js
import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send OTP email
export async function sendOtpEmail(email, otp, name) {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Development mode: No email credentials found');
      console.log(`Email would be sent to: ${email}`);
      console.log(`OTP: ${otp}`);
      return { success: true, development: true };
    }

    const transporter = createTransporter();

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"LLMs.txt Generator" <noreply@immortalseo.com>',
      to: email,
      subject: 'Verify your email for LLMs.txt Generator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your email address</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with LLMs.txt Generator. Please use the verification code below to complete your registration:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${otp}</strong>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this verification, you can safely ignore this email.</p>
          <p>Best regards,<br>The LLMs.txt Generator Team</p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}