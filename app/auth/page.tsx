import { redirect } from 'next/navigation'

export default function AuthRoot() {
  // Redirect /auth -> /auth/login
  redirect('/auth/login')
}
