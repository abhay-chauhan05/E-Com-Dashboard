// app/auth/login/page.tsx

import { Suspense } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  // Server-side: if user already has a session, redirect to dashboard
  const session = await getServerSession(authOptions)
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Login to Dashboard</h2>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          {/* Client LoginForm handles hooks like useSearchParams */}
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
