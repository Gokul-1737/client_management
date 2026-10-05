'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Bot
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { setCurrentUser } from '@/lib/auth'
import { Profile } from '@/lib/types'
import { BrandLogo } from '@/components/layout/brand-logo'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success, error: toastError } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const redirectTo = searchParams.get('redirectTo')

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) newErrors.email = 'Business email is required'
    else if (!/\S+@\S+\.\S+/.test(email.trim())) newErrors.email = 'Invalid email address'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const trimmedEmail = email.trim().toLowerCase()

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })

      if (error) {
        toastError('Sign In Failed', 'The email or password was not accepted.')
        setLoading(false)
        return
      }

      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError || !profile) {
          toastError('Profile unavailable', 'Your account is authenticated, but its profile could not be loaded.')
          await supabase.auth.signOut()
          return
        }

        const userProfile: Profile = {
          id: data.user.id,
          email: data.user.email || trimmedEmail,
          full_name: profile.full_name,
          role: profile.role,
          phone: profile.phone,
          avatar_url: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.full_name)}`,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        }

        const { data: membership } = await supabase
          .from('company_members')
          .select('company_id')
          .eq('profile_id', data.user.id)
          .maybeSingle()

        if (membership) {
          const { data: company } = await supabase
            .from('companies')
            .select('name')
            .eq('id', membership.company_id)
            .maybeSingle()
          userProfile.company_name = company?.name
        }

        setCurrentUser(userProfile)
        success('Welcome back', `Signed in as ${userProfile.full_name}`)

        const roleRedirects = {
          CLIENT: '/client/dashboard',
          ADMIN: '/admin/dashboard',
          EMPLOYEE: '/employee/dashboard',
        }
        const destination = redirectTo || roleRedirects[userProfile.role as keyof typeof roleRedirects] || '/client/dashboard'
        router.push(destination)
        router.refresh()
      }
    } catch {
      toastError('Login Error', 'Unable to connect to authentication server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Branding (Client-Focused Experience) */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-12 relative overflow-hidden text-white shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/30 -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-400/30 translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative">
          <BrandLogo portal="Client portal" dark />
        </div>

        {/* Hero content */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-indigo-100 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Enterprise Client Workspace</span>
            </div>
            <h1 className="text-2xl md:text-[1.7rem] font-extrabold text-white leading-tight">
              Track Projects, Approve Deliverables, and Collaborate with Top Experts
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-md">
              Sign in to manage your company tasks, review submitted deliverables in real time, and let our intelligent engine match your requests with verified specialists.
            </p>
          </div>

          {/* Workflow pillars */}
          <div className="space-y-3">
            {[
              {
                icon: Bot,
                title: 'Automated Task Routing',
                desc: 'Requirements are instantly analyzed and assigned to skilled engineers.',
              },
              {
                icon: ShieldCheck,
                title: 'Review & Quality Control',
                desc: 'Inspect code, design assets, and video edits before final approval.',
              },
              {
                icon: CheckCircle2,
                title: 'Transparent Project Delivery',
                desc: 'Live milestones, milestone audits, and SLA adherence tracking.',
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{feature.title}</h4>
                  <p className="text-xs text-indigo-200/90 leading-normal mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Stats */}
        <div className="relative grid grid-cols-3 gap-3">
          {[
            { value: '99.4%', label: 'On-Time Delivery' },
            { value: '< 2 Hrs', label: 'Response Time' },
            { value: '500+', label: 'Active Teams' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
              <div className="text-lg font-bold text-white tabular-nums">{stat.value}</div>
              <div className="text-[11px] text-indigo-200 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Client Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <BrandLogo portal="Client portal" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to Client Portal</h2>
            <p className="text-slate-500 text-sm mt-1">Access your project deliverables, milestones, and task dashboard.</p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-slate-50 px-3 text-xs text-slate-400 uppercase font-medium">Or enter credentials</span>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business Email"
              type="email"
              placeholder="e.g. client@abc.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              autoComplete="email"
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={cn(
                    'w-full h-10 pl-9 pr-10 text-sm bg-white border border-slate-200 rounded-lg',
                    'placeholder-slate-400 text-slate-900',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
                    'transition-colors duration-150',
                    errors.password && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">Remember this device</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full h-11 px-6 rounded-xl font-semibold text-sm text-white',
                'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600',
                'hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700',
                'shadow-md hover:shadow-lg hover:shadow-indigo-500/25',
                'flex items-center justify-center gap-2 cursor-pointer transition-all duration-200',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2'
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Signing in to Client Portal...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Client Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="space-y-4 pt-2 text-center">
            <div className="text-xs text-slate-500">
              Need a client account?{' '}
              <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
                Create an organization account
              </Link>
            </div>

            {/* Hidden / Discreet Staff Portal Link */}
            <div className="border-t border-slate-100 pt-3">
              <Link
                href="/admin-login"
                className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Internal Staff Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
