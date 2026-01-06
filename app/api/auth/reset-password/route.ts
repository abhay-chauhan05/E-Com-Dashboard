// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyOTP } from '@/lib/otp'
import { hashPassword } from '@/lib/password'
import { ZodError } from 'zod'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, otp, newPassword } = resetPasswordSchema.parse(body)

    // Verify OTP (without deleting yet)
    const isValid = await verifyOTP(email, otp, false)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Delete the OTP token after successful password reset
    await prisma.oTPToken.deleteMany({
      where: { email, otp },
    })

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
