'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Shield, Lock, Mail, Eye, EyeOff, Zap, ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { setCurrentUser } from '@/lib/auth'
import { Profile } from '@/lib/types'

export default function AdminLoginPage() {
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const [email, setEmail] = useState('admin@taskflow.ai')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setErrors({ email: 'Admin email is required' })
      return
    }
    if (!password) {
      setErrors({ password: 'Password is required' })
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

      if (error || !data.user) {
        toastError('Authentication failed', 'The staff email or password was not accepted.')
        return
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()

      if (profile?.role !== 'ADMIN') {
        toastError('Access denied', 'Your account does not have administrator privileges.')
        await supabase.auth.signOut()
        return
      }

      const userProfile: Profile = {
        id: data.user.id,
        email: data.user.email || email.trim(),
        full_name: profile.full_name,
        role: profile.role,
        phone: profile.phone,
        avatar_url: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.full_name)}`,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }

      setCurrentUser(userProfile)

      success('Admin authorized', 'Redirecting to the command center.')
      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      toastError('Authentication Error', 'Please check your admin credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Staff Administration Portal</h1>
          <p className="text-xs text-slate-400">Restricted system for authorized operations and engineering staff</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Staff Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@taskflow.ai"
                  className={cn(
                    'w-full h-10 pl-9 pr-3 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500'
                  )}
                  required
                />
              </div>
              {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full h-10 pl-9 pr-10 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full h-11 rounded-xl font-semibold text-sm text-white',
                'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500',
                'flex items-center justify-center gap-2 cursor-pointer transition-all duration-200',
                'disabled:opacity-60 disabled:cursor-not-allowed shadow-lg'
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Client Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
