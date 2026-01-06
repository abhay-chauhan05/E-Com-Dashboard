// app/auth/error/page.tsx

import { Suspense } from 'react'
import AuthError from '@/components/AuthError'

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <AuthError />
    </Suspense>
  )
}
