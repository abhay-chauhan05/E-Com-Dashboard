'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const dev = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Authentication Error</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {error === 'Invalid email or password'
              ? 'Invalid email or password. Please try again.'
              : 'An error occurred during authentication. Please try again.'}
          </p>
          {dev && error && (
            <p className="mt-2 text-sm text-red-500">Debug: {error}</p>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="w-full block text-center px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 font-medium smooth-transition"
          >
            Back to Login
          </Link>
          <Link
            href="/auth/signup"
            className="w-full block text-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium smooth-transition"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  )
}
