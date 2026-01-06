// lib/email.ts
import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    // Prefer explicit SMTP credentials if provided (works in dev and prod).
    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    } else if (process.env.NODE_ENV === 'development') {
      // Fallback to a local dev SMTP (MailHog/MailCatcher) if available
      transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
      })
    } else {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    }
  }
  return transporter
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  try {
    const transporter = getTransporter()

    // SECURITY: Include the actual OTP in the email HTML sent to user
    // This is the ONLY place where OTP should ever be visible to the user
    // It is NOT returned in API responses and NOT logged to console
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@product-dashboard.local',
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Your one-time password (OTP) is:</p>
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0; color: #333;">
              ${otp}
            </p>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>Enter this code on the password reset page to continue.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            If you didn't request a password reset, please ignore this email and do not share this code with anyone.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    // Do NOT log or expose the OTP anywhere (console, response, UI).
    // Allow the API to return a generic success message so callers
    // cannot distinguish whether the email delivery succeeded.
  }
}
