'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { DEMO_USERS } from '@/lib/auth'
import { User, Mail, Phone, Building, Camera, Shield } from 'lucide-react'

export default function ClientProfilePage() {
  const { success } = useToast()
  const [fullName, setFullName] = useState(DEMO_USERS.client.full_name)
  const [email, setEmail] = useState(DEMO_USERS.client.email)
  const [phone, setPhone] = useState(DEMO_USERS.client.phone || '+1 (555) 018-7742')
  const [title, setTitle] = useState('Director of Product Innovation')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    success('Profile Updated', 'Your personal account profile details have been saved.')
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Personal Profile & Credentials"
        subtitle="Manage your personal identification, notification email, and security preferences"
      />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-6">
          {/* Avatar banner */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative">
              <Avatar
                name={fullName}
                src={DEMO_USERS.client.avatar_url}
                size="xl"
                className="w-24 h-24 text-2xl"
              />
              <button
                type="button"
                onClick={() => success('Avatar updated')}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500">{title} • Acme Corporation</p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
                <Shield className="w-3 h-3" /> Client Account Verified
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                label="Job Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                leftIcon={<Building className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                label="Direct Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
