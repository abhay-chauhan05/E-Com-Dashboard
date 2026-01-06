"use client"

import { signIn } from 'next-auth/react'

export default function SocialAuth({ callbackUrl = '/dashboard' }) {
  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-blue-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 font-medium smooth-transition">Or continue with</span>
        </div>
      </div>

      <button
        onClick={() => signIn('google', { callbackUrl })}
        className="w-full mt-3 inline-flex justify-center py-2 px-4 border-2 border-teal-300 rounded-md shadow-sm bg-teal-50 dark:bg-gray-800 text-sm font-medium text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-gray-700 transition smooth-transition"
      >
        <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.5h146.9c-6.3 34.1-25 62.9-53.3 82.3v68.4h86.1c50.3-46.4 81.8-114.6 81.8-195.8z"/>
          <path fill="#34A853" d="M272 544.3c72.9 0 134.1-24.1 178.8-65.3l-86.1-68.4c-24.1 16.2-55 25.8-92.7 25.8-71 0-131.3-47.8-152.9-112.1H30.5v70.6C75.6 490 168.4 544.3 272 544.3z"/>
          <path fill="#FBBC05" d="M119.1 319.3c-10.7-31.9-10.7-66.1 0-98l-88.6-70.6C8.9 186.9 0 228 0 272s8.9 85.1 30.5 121.3l88.6-74z"/>
          <path fill="#EA4335" d="M272 108.6c39.6 0 75.3 13.6 103.4 40.3l77.4-77.4C405.9 24.6 344.7 0 272 0 168.4 0 75.6 54.3 30.5 136.6l88.6 70.6C140.7 156.4 201 108.6 272 108.6z"/>
        </svg>
        <span className="ml-2">Google</span>
      </button>
    </div>
  )
}
