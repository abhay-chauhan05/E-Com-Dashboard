import { Suspense } from 'react'
import DashboardClient from '@/components/DashboardClient'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Server-side session check: redirect unauthenticated users to login
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <Suspense fallback={<div className="text-center py-20">Loading dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  )
}
