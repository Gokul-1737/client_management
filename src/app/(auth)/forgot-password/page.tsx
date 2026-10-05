'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import { Zap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { error: toastError } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toastError('Reset request failed', 'We could not send the reset link. Check the email and try again.')
        return
      }
      setLoading(false)
      setSubmitted(true)
    } catch {
      toastError('Connection failed', 'Unable to reach Supabase right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-8 space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Probyzaar Technologies</span>
        </div>

        {!submitted ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
              <p className="text-slate-500 text-sm mt-1">
                Enter your work email and we will send you a password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Work Email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                Send Password Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Check your inbox</h2>
            <p className="text-slate-500 text-sm">
              We sent a verification link to <span className="font-semibold text-slate-800">{email}</span>. Click the link inside to set a new password.
            </p>
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
