// lib/otp.ts
import { prisma } from './prisma'
import crypto from 'crypto'

const OTP_EXPIRY_MINUTES = 10

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

export async function createOTP(email: string, userId?: string): Promise<string> {
  const otp = generateOTP()
  const hashedOTP = hashOTP(otp)
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  // Delete any existing OTP tokens for this email to prevent multiple active OTPs
  await prisma.oTPToken.deleteMany({
    where: { email },
  })

  await prisma.oTPToken.create({
    data: {
      email,
      otp: hashedOTP,
      expiresAt,
      userId,
    },
  })

  // Return only the plain OTP (never store it unencrypted)
  return otp
}

export async function verifyOTP(email: string, otp: string, shouldDelete: boolean = false): Promise<boolean> {
  const hashedOTP = hashOTP(otp)

  const token = await prisma.oTPToken.findFirst({
    where: {
      email,
      otp: hashedOTP,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (token) {
    if (shouldDelete) {
      await prisma.oTPToken.delete({
        where: { id: token.id },
      })
    }
    return true
  }

  return false
}

export async function deleteExpiredOTPs(): Promise<void> {
  await prisma.oTPToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}
