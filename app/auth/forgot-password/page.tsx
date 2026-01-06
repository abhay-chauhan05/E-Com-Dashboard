// app/auth/forgot-password/page.tsx
'use client'

import { Suspense } from 'react'
import ForgotPasswordForm from '@/components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Reset your password
          </h2>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
