// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createOTP } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'
import { resetPasswordSchema } from '@/lib/validation'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = resetPasswordSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if email exists (security best practice)
      return NextResponse.json(
        { message: 'If an account with this email exists, an OTP has been sent' },
        { status: 200 }
      )
    }

    // Generate and send OTP
    const otp = await createOTP(email, user.id)
    await sendOTPEmail(email, otp)

    // SECURITY: NEVER return OTP in response - not even in development
    // OTP should ONLY be sent to user's email
    return NextResponse.json(
      { message: 'If an account with this email exists, an OTP has been sent' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
