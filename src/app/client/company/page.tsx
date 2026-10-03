'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { Building2, Users, Plus, Mail, Shield, Check } from 'lucide-react'

export default function ClientCompanyPage() {
  const { success } = useToast()
  const [companyName, setCompanyName] = useState('Acme Corporation')
  const [website, setWebsite] = useState('https://acmecorp.com')
  const [industry, setIndustry] = useState('Enterprise Software & FinTech')
  const [address, setAddress] = useState('500 Howard Street, Suite 400, San Francisco, CA')

  const [teamMembers, setTeamMembers] = useState([
    { name: 'Sarah Jenkins', email: 'sarah@acme.com', role: 'Organization Owner', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { name: 'Marcus Brody', email: 'm.brody@acme.com', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { name: 'Chloe Vance', email: 'c.vance@acme.com', role: 'Billing Specialist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  ])

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault()
    success('Company Profile Updated', 'Organization details have been saved successfully.')
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
                required
              />
              <Input
                label="Corporate Website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Industry Domain"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                required
              />
              <Input
                label="Headquarters Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                Save Company Changes
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
