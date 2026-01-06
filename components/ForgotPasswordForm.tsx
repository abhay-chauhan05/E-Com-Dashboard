'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Step = 'email' | 'otp' | 'reset'

function ForgotPasswordFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
        setError(errorMsg || 'Failed to send OTP')
        return
      }

      // SECURITY: Never show OTP on UI, never auto-fill input
      // OTP is sent ONLY to user's email
      setStep('otp')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
        setError(errorMsg || 'Invalid OTP')
        return
      }

      setStep('reset')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
        setError(errorMsg || 'Failed to reset password')
        return
      }

      router.push('/auth/login?message=Password reset successful')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="rounded-md bg-gradient-to-br from-red-50 to-orange-50 p-4 mb-6 border-2 border-red-200">
          <div className="text-sm font-medium text-red-700">{error}</div>
        </div>
      )}

      {step === 'email' && (
        <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-blue-300 placeholder-blue-400 text-blue-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        </form>
      )}

      {step === 'otp' && (
        <>
          <div className="rounded-md bg-gradient-to-br from-green-50 to-emerald-50 p-4 mb-6 border-2 border-green-200">
            <div className="text-sm font-medium text-green-700">
              ✓ OTP has been sent to your email. Check your inbox and enter it below.
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <p className="text-sm text-gray-600">We sent an OTP to {email}</p>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-blue-300 placeholder-blue-400 text-blue-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        </>
      )}

      {step === 'reset' && (
        <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-blue-300 placeholder-blue-400 text-blue-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-blue-300 placeholder-blue-400 text-blue-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </>
  )
}

export default function ForgotPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordFormContent />
    </Suspense>
  )
}
