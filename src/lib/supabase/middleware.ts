import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const pathname = request.nextUrl.pathname

  // Segment-aware prefix match so /admin-login is not treated as /admin
  const matchesPrefix = (target: string, prefix: string) =>
    target === prefix || target.startsWith(`${prefix}/`)

  // Protected routes requiring authentication
  const protectedPrefixes = ['/client', '/admin', '/employee']
  const isProtectedRoute = protectedPrefixes.some(prefix => matchesPrefix(pathname, prefix))

  // Auth routes (redirect if already logged in)
  const authRoutes = ['/login', '/signup', '/forgot-password', '/admin-login']
  const isAuthRoute = authRoutes.some(route => matchesPrefix(pathname, route))

  // 1. Check for demo session cookie first (immediate local development support)
  const demoRole = request.cookies.get('taskflow_role')?.value
  const demoUserId = request.cookies.get('taskflow_user_id')?.value

  if (demoRole && demoUserId) {
    if (isAuthRoute) {
      if (pathname === '/admin-login') {
        if (demoRole === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        // Allow switching to admin from another persona
        return supabaseResponse
      }

      const roleRedirect = {
        CLIENT: '/client/dashboard',
        ADMIN: '/admin/dashboard',
        EMPLOYEE: '/employee/dashboard',
      }
      const redirectPath = roleRedirect[demoRole as keyof typeof roleRedirect] || '/client/dashboard'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }

    if (isProtectedRoute) {
      const isClientRoute = matchesPrefix(pathname, '/client')
      const isAdminRoute = matchesPrefix(pathname, '/admin')
      const isEmployeeRoute = matchesPrefix(pathname, '/employee')

      // Admin has access to all portals for auditing and management
      if (demoRole === 'ADMIN') {
        return supabaseResponse
      }

      if (isClientRoute && demoRole !== 'CLIENT') {
        return NextResponse.redirect(new URL(demoRole === 'EMPLOYEE' ? '/employee/dashboard' : '/login', request.url))
      }

      if (isAdminRoute && demoRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin-login', request.url))
      }

      if (isEmployeeRoute && demoRole !== 'EMPLOYEE') {
        return NextResponse.redirect(new URL(demoRole === 'CLIENT' ? '/client/dashboard' : '/login', request.url))
      }
    }

    return supabaseResponse
  }

  // 2. Check Supabase auth if non-placeholder configuration is present
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

  let hasSupabaseUser = false

  if (isSupabaseConfigured) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              supabaseResponse = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const {
        data: { user },
      } = await supabase.auth.getUser()

      hasSupabaseUser = Boolean(user)

      if (!user && isProtectedRoute) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      if (user && isAuthRoute) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile) {
          const roleRedirect = {
            CLIENT: '/client/dashboard',
            ADMIN: '/admin/dashboard',
            EMPLOYEE: '/employee/dashboard',
          }
          const redirectPath = roleRedirect[profile.role as keyof typeof roleRedirect] || '/client/dashboard'
          return NextResponse.redirect(new URL(redirectPath, request.url))
        }
      }
    } catch {
      // Fall through to redirect if protected
    }
  }

  if (isProtectedRoute && !demoRole && !hasSupabaseUser) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
