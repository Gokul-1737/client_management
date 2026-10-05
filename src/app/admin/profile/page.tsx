'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { BrandLogo } from '@/components/layout/brand-logo'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { getCurrentUser, getDemoUserForRole, updateProfile } from '@/lib/auth'
import type { Profile } from '@/lib/types'
import { Mail, Phone, UserRound, ShieldCheck } from 'lucide-react'

export default function AdminProfilePage() {
  const { success, error: toastError } = useToast()
  const [profile, setProfile] = useState<Profile>(() => getCurrentUser() || getDemoUserForRole('ADMIN'))
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [email, setEmail] = useState(profile.email || '')
  const [phone, setPhone] = useState(profile.phone || '')

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const next = await updateProfile(profile, {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      })
      setProfile(next)
      success('Profile Updated', 'Your administrator profile is now up to date.')
    } catch {
      toastError('Profile not saved', 'We could not save your changes. Please try again.')
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader title="Administrator Profile" subtitle="Update the identity and contact details shown across your workspace" />
      <main className="mx-auto w-full max-w-4xl space-y-6 p-6 md:p-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <BrandLogo portal="Command center" />
          <span className="hidden items-center gap-1.5 text-xs font-semibold text-emerald-700 sm:flex">
            <ShieldCheck className="h-4 w-4" /> Verified administrator
          </span>
        </div>
        <Card padding="lg" className="space-y-6 border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-5 border-b border-slate-100 pb-6 sm:flex-row">
            <Avatar name={fullName} src={profile.avatar_url} size="xl" className="h-24 w-24 text-2xl" />
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-slate-900">{fullName || 'Administrator'}</h2>
              <p className="mt-1 text-xs text-slate-500">Your name and contact details sync to every admin workspace header.</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full Name" value={fullName} onChange={event => setFullName(event.target.value)} leftIcon={<UserRound className="h-4 w-4 text-slate-400" />} required />
              <Input label="Email Address" type="email" value={email} onChange={event => setEmail(event.target.value)} leftIcon={<Mail className="h-4 w-4 text-slate-400" />} required />
            </div>
            <Input label="Direct Phone Number" value={phone} onChange={event => setPhone(event.target.value)} leftIcon={<Phone className="h-4 w-4 text-slate-400" />} />
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <Button type="submit" className="bg-slate-950 text-white hover:bg-slate-800">Save Profile Changes</Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
