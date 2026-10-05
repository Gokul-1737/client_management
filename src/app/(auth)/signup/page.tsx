'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { 
  Eye, 
  EyeOff, 
  Zap, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Check,
  Bot
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/layout/brand-logo'
import { setCurrentUser } from '@/lib/auth'
import type { Profile } from '@/lib/types'

export default function SignupPage() {
  const router = useRouter()
  const { success, error: toastError, info } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  
  const [form, setForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // Calculate password strength (0 to 4)
  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (!pass) return score
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1
    return score
  }

  const passwordStrength = getPasswordStrength(form.password)

  const getStrengthLabel = (score: number) => {
    if (!form.password) return { text: '', color: 'bg-slate-200', textColor: 'text-slate-400' }
    if (score <= 1) return { text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' }
    if (score === 2) return { text: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600' }
    if (score === 3) return { text: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600' }
    return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' }
  }

  const strengthMeta = getStrengthLabel(passwordStrength)

  // 1-Click Fill Demo Data
  const handleQuickFill = () => {
    const randomId = Math.floor(Math.random() * 900) + 100
    setForm({
      fullName: 'David Sterling',
      companyName: `Apex Innovations ${randomId}`,
      email: `david.sterling${randomId}@apex.io`,
      phone: '+1 (555) 394-2810',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    })
    setErrors({})
    info('Demo Data Filled', 'Ready to test instant account registration!')
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!form.email.trim()) newErrors.email = 'Business email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email address'
    
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your password'
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (!agreedToTerms) {
      newErrors.terms = 'Please accept the Terms of Service to continue'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            company_name: form.companyName.trim(),
            phone: form.phone.trim(),
            role: 'CLIENT',
          },
        },
      })

      if (error || !data.user) {
        toastError('Account creation failed', 'We could not create your account. Please check your details and try again.')
        return
      }

      if (!data.session) {
        info('Confirm your email', 'Your account was created. Check your inbox before signing in.')
        return
      }

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email || form.email.trim().toLowerCase(),
        full_name: form.fullName.trim(),
        role: 'CLIENT',
        phone: form.phone.trim() || null,
      }, { onConflict: 'id' })

      if (profileError) {
        toastError('Profile setup failed', 'Your account was created, but we could not create its profile. Please contact an administrator.')
        await supabase.auth.signOut()
        return
      }

      const { data: existingCompany, error: companyLookupError } = await supabase
        .from('companies')
        .select('id')
        .eq('created_by', data.user.id)
        .maybeSingle()

      if (companyLookupError) {
        toastError('Company setup failed', 'Your account was created, but we could not load your company details.')
        return
      }

      const { data: company, error: companyError } = existingCompany
        ? { data: existingCompany, error: null }
        : await supabase
          .from('companies')
          .insert({
            name: form.companyName.trim(),
            created_by: data.user.id,
          })
          .select('id')
          .single()

      if (companyError || !company) {
        toastError('Company setup failed', 'Your account was created, but we could not save your company details.')
        return
      }

      const { error: membershipError } = await supabase.from('company_members').upsert({
        company_id: company.id,
        profile_id: data.user.id,
        role: 'OWNER',
      }, { onConflict: 'company_id,profile_id' })

      if (membershipError) {
        toastError('Company membership setup failed', 'Your account was created, but we could not connect you to your company.')
        return
      }

      const userProfile: Profile = {
        id: data.user.id,
        email: data.user.email || form.email.trim().toLowerCase(),
        full_name: form.fullName.trim(),
        role: 'CLIENT',
        phone: form.phone.trim() || undefined,
        company_name: form.companyName.trim(),
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.fullName.trim())}`,
      }
      setCurrentUser(userProfile)
      success('Account created', `Welcome to Probyzaar Technologies, ${form.fullName}.`)
      router.push('/client/dashboard')
      router.refresh()
    } catch {
      toastError('Connection failed', 'Unable to reach Supabase right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Hero / Branding (Consistent with Login) */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-12 relative overflow-hidden text-white shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/30 -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-400/30 translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative">
          <BrandLogo portal="Client portal setup" dark />
        </div>

        {/* Hero content */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-indigo-100 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Instant AI Onboarding for Organizations</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              Deliver Projects 3x Faster with Autonomous Task Assignment
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-md">
              Create your organization account today to submit tasks, track milestones in real time, and let our AI match your requirements with verified domain experts.
            </p>
          </div>

          {/* Workflow pillars */}
          <div className="space-y-3">
            {[
              {
                icon: Bot,
                title: 'AI Smart Task Decomposition',
                desc: 'Upload requirements and watch tasks decompose into structured work packets.',
              },
              {
                icon: ShieldCheck,
                title: 'Real-Time Verification & Review',
                desc: 'Approve deliverables, request revisions, and communicate in one unified hub.',
              },
              {
                icon: CheckCircle2,
                title: 'Transparent Budget & Progress',
                desc: 'Track milestones, burndown velocity, and live expert status 24/7.',
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
            { value: '500+', label: 'Active Teams' },
            { value: '99.4%', label: 'On-Time Delivery' },
            { value: '15 Min', label: 'Fast Setup' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
              <div className="text-lg font-bold text-white tabular-nums">{stat.value}</div>
              <div className="text-[11px] text-indigo-200 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <BrandLogo portal="Client portal setup" />
          </div>

          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
              <p className="text-sm text-slate-500 mt-0.5">Set up your client workspace in under a minute</p>
            </div>
            
            {/* Quick Demo Fill button */}
            <button
              type="button"
              onClick={handleQuickFill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Fill Demo Info</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="David Sterling"
                value={form.fullName}
                onChange={e => update('fullName', e.target.value)}
                error={errors.fullName}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                label="Company Name"
                placeholder="Apex Technologies"
                value={form.companyName}
                onChange={e => update('companyName', e.target.value)}
                error={errors.companyName}
                leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Email"
                type="email"
                placeholder="david@company.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />
            </div>

            {/* Password Field */}
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
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
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
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Security strength:</span>
                    <span className={cn('font-semibold', strengthMeta.textColor)}>{strengthMeta.text}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map(step => (
                      <div
                        key={step}
                        className={cn(
                          'rounded-full transition-all duration-300',
                          passwordStrength >= step ? strengthMeta.color : 'bg-slate-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  className={cn(
                    'w-full h-10 pl-9 pr-10 text-sm bg-white border border-slate-200 rounded-lg',
                    'placeholder-slate-400 text-slate-900',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
                    'transition-colors duration-150',
                    errors.confirmPassword && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms of Service Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => {
                    setAgreedToTerms(e.target.checked)
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }))
                  }}
                  className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  By creating an account, you agree to our{' '}
                  <span className="text-indigo-600 hover:underline font-medium">Terms of Service</span> and{' '}
                  <span className="text-indigo-600 hover:underline font-medium">Privacy Policy</span>.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-rose-600 mt-1">{errors.terms}</p>}
            </div>

            {/* Prominent High-Visibility Create Button */}
            <div className="pt-3">
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
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Perks Summary */}
          <div className="py-3 px-4 rounded-xl bg-slate-100/70 border border-slate-200/70 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Free 14-day client trial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Automated expert matching</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Role-based access control</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
