'use client'

import React, { useEffect, useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { Building2, Users, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUser, getDemoUserForRole, notifyProfileUpdated } from '@/lib/auth'
import type { Company, Profile } from '@/lib/types'

export default function ClientCompanyPage() {
  const { success, error: toastError } = useToast()
  const [profile] = useState<Profile>(() => getCurrentUser() || getDemoUserForRole('CLIENT'))
  const [company, setCompany] = useState<Company | null>(null)
  const [companyName, setCompanyName] = useState(profile.company_name || 'Acme Corporation')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [teamMembers, setTeamMembers] = useState([
    { name: 'Sarah Jenkins', email: 'sarah@acme.com', role: 'Organization Owner', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { name: 'Marcus Brody', email: 'm.brody@acme.com', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { name: 'Chloe Vance', email: 'c.vance@acme.com', role: 'Billing Specialist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  ])

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    const loadCompany = async () => {
      const configured = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
      )

      if (!configured || profile.id.startsWith('u0000000-')) {
        try {
          const stored = window.localStorage.getItem('taskflow_company_profile')
          if (stored) {
            const localCompany = JSON.parse(stored) as Partial<Company>
            setCompanyName(localCompany.name || '')
            setWebsite(localCompany.website || '')
            setIndustry(localCompany.industry || '')
            setAddress(localCompany.address || '')
          }
        } catch {
          toastError('Company details unavailable', 'Saved local company details could not be read.')
        }
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data: memberships, error: membershipError } = await supabase
          .from('company_members')
          .select('company_id')
          .eq('profile_id', profile.id)
          .limit(1)

        if (membershipError) throw membershipError
        let companyId = memberships?.[0]?.company_id

        if (!companyId) {
          const { data: ownedCompany, error: ownedCompanyError } = await supabase
            .from('companies')
            .select('*')
            .eq('created_by', profile.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle()

          if (ownedCompanyError) throw ownedCompanyError
          if (ownedCompany) {
            companyId = ownedCompany.id
            const { error: membershipInsertError } = await supabase
              .from('company_members')
              .insert({ company_id: ownedCompany.id, profile_id: profile.id, role: 'OWNER' })
            if (membershipInsertError) throw membershipInsertError
          }
        }

        if (!companyId) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single()

        if (error) throw error
        setCompany(data as Company)
        setCompanyName(data.name || '')
        setWebsite(data.website || '')
        setIndustry(data.industry || '')
        setAddress(data.address || '')
      } catch {
        toastError('Company details unavailable', 'We could not load your saved company details.')
      } finally {
        setLoading(false)
      }
    }

    void loadCompany()
  }, [profile.id, toastError])

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const configured = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
      )

      if (configured && !profile.id.startsWith('u0000000-')) {
        const supabase = createClient()
        const companyValues = {
            name: companyName.trim(),
            website: website.trim() || null,
            industry: industry.trim() || null,
            address: address.trim() || null,
        }
        let data: Company | null = null

        if (company) {
          const result = await supabase
            .from('companies')
            .update(companyValues)
            .eq('id', company.id)
            .select('*')
            .single()
          if (result.error) throw result.error
          data = result.data as Company
        } else {
          const result = await supabase
            .from('companies')
            .insert({ ...companyValues, created_by: profile.id })
            .select('*')
            .single()
          if (result.error) throw result.error
          data = result.data as Company

          const { error: membershipError } = await supabase
            .from('company_members')
            .insert({ company_id: data.id, profile_id: profile.id, role: 'OWNER' })
          if (membershipError) throw membershipError
        }

        setCompany(data)
      } else {
        window.localStorage.setItem('taskflow_company_profile', JSON.stringify({
          name: companyName.trim(),
          website: website.trim(),
          industry: industry.trim(),
          address: address.trim(),
        }))
      }

      notifyProfileUpdated({ ...profile, company_name: companyName.trim() })
      success('Company Profile Updated', 'Organization details have been saved successfully.')
    } catch (error) {
      console.error('Company profile save failed.', error)
      const message = error instanceof Error && error.message
        ? error.message
        : 'We could not save your organization details. Please try again.'
      toastError('Company profile not saved', message)
    } finally {
      setSaving(false)
    }
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !inviteName) return

    setTeamMembers(prev => [
      ...prev,
      { name: inviteName, email: inviteEmail, role: 'Team Member', avatar: '' },
    ])
    setShowInviteModal(false)
    setInviteEmail('')
    setInviteName('')
    success('Invitation Dispatched', `Invited ${inviteEmail} to your organization team.`)
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Company Profile & Organization Team"
        subtitle="Manage your business information, workspace access, and collaborative team seats"
      />

      <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
        {/* Company Details Form */}
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Organization Information</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified Enterprise Client
            </span>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Legal Name"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                disabled={loading || saving}
                required
              />
              <Input
                label="Corporate Website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                disabled={loading || saving}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Industry Domain"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                disabled={loading || saving}
                required
              />
              <Input
                label="Headquarters Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                disabled={loading || saving}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading || saving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                {saving ? 'Saving Company Changes…' : 'Save Company Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Team Members List (Stitch: Screen 17) */}
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Organization Team Members</h3>
                <p className="text-xs text-slate-500">Colleagues who have access to submit and review briefs</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setShowInviteModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Invite Colleague
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} src={member.avatar} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                    <p className="text-[11px] text-slate-500">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-slate-600 px-2 py-0.5 rounded-full bg-slate-100">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Invite Colleague Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Invite Organization Member</h3>
              <p className="text-xs text-slate-500">
                Grant team members permission to submit tasks, comment on deliverables, and download approved assets.
              </p>
              <form onSubmit={handleInvite} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Alex Morgan"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  required
                />
                <Input
                  label="Work Email"
                  type="email"
                  placeholder="e.g. alex@acme.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 text-white font-medium text-xs">
                    Send Invitation
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
