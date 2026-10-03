import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('taskflow_role')?.value

  if (demoRole) {
    const roleRedirects: Record<string, string> = {
      CLIENT: '/client/dashboard',
      ADMIN: '/admin/dashboard',
      EMPLOYEE: '/employee/dashboard',
    }
    redirect(roleRedirects[demoRole] || '/login')
  }

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile) {
          const roleRedirects: Record<string, string> = {
            CLIENT: '/client/dashboard',
            ADMIN: '/admin/dashboard',
            EMPLOYEE: '/employee/dashboard',
          }
          redirect(roleRedirects[profile.role] || '/login')
        }
      }
    } catch {
      // Fall through to /login
    }
  }

  redirect('/login')
}
