'use client'

import React, { useEffect, useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Building2, Loader2, Mail, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUser } from '@/lib/auth'
import type { Company, Profile } from '@/lib/types'

interface ClientOrganization extends Company {
  contact?: Profile
  memberCount: number
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadClients = async () => {
      try {
        const localCompany = typeof window !== 'undefined'
          ? window.localStorage.getItem('taskflow_company_profile')
          : null
        const currentUser = getCurrentUser()

        if (localCompany && (!currentUser || currentUser.id.startsWith('u0000000-'))) {
          const saved = JSON.parse(localCompany) as Partial<Company>
          const now = new Date().toISOString()
          setClients([{
            id: 'local-company',
            name: saved.name || 'Unnamed company',
            website: saved.website,
            industry: saved.industry,
            address: saved.address,
            created_at: now,
            updated_at: now,
            contact: currentUser || undefined,
            memberCount: currentUser ? 1 : 0,
          }])
          return
        }

        const supabase = createClient()
        const [{ data: companies, error: companiesError }, { data: memberships, error: membershipsError }] = await Promise.all([
          supabase.from('companies').select('*').order('created_at', { ascending: false }),
          supabase.from('company_members').select('company_id, profile_id, role'),
        ])

        if (companiesError) throw companiesError
        if (membershipsError) throw membershipsError

        const profileIds = [
          ...new Set([
            ...(memberships || []).map(member => member.profile_id),
            ...(companies || []).map(company => company.created_by).filter(Boolean),
          ]),
        ] as string[]
        const { data: profiles, error: profilesError } = profileIds.length
          ? await supabase.from('profiles').select('*').in('id', profileIds)
          : { data: [], error: null }

        if (profilesError) throw profilesError

        const profileById = new Map((profiles || []).map(profile => [profile.id, profile as Profile]))
        const membershipsByCompany = new Map<string, typeof memberships>()

        for (const membership of memberships || []) {
          const current = membershipsByCompany.get(membership.company_id) || []
          current.push(membership)
          membershipsByCompany.set(membership.company_id, current)
        }

        setClients((companies || []).map(company => {
          const companyMemberships = membershipsByCompany.get(company.id) || []
          const owner = companyMemberships.find(member => member.role === 'OWNER') || companyMemberships[0]
          const contactProfileId = owner?.profile_id || company.created_by
          return {
            ...(company as Company),
            contact: contactProfileId ? profileById.get(contactProfileId) : undefined,
            memberCount: companyMemberships.length,
          }
        }))
      } catch (loadError) {
        console.error('Admin client organizations load failed.', loadError)
        setError(loadError instanceof Error && loadError.message
          ? loadError.message
          : 'Client organizations could not be loaded. Check the Supabase connection and try again.')
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader
        title="Client Organization Directory"
        subtitle="Manage client enterprise accounts, contract tiers, and project delivery histories"
      />

      <main className="mx-auto w-full max-w-7xl space-y-6 p-6 md:p-8">
        <Card padding="none" className="overflow-hidden border-slate-200/80 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading client organizations
            </div>
          ) : error ? (
            <div className="p-12 text-center text-sm text-rose-600">{error}</div>
          ) : clients.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">No client organizations yet</p>
              <p className="mt-1 text-xs text-slate-500">New client companies will appear here after signup.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/80 uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Client Company</th>
                    <th className="px-4 py-3 font-semibold">Primary Contact</th>
                    <th className="px-4 py-3 font-semibold">Company Details</th>
                    <th className="px-4 py-3 font-semibold">Members</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map(client => (
                    <tr key={client.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{client.name}</span>
                            <p className="mt-0.5 text-[11px] text-slate-400">{client.industry || 'Industry not provided'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {client.contact ? (
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <span>{client.contact.full_name} · {client.contact.email}</span>
                          </div>
                        ) : 'Contact not available'}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <div className="max-w-xs space-y-0.5">
                          <p className="truncate">{client.website || 'Website not provided'}</p>
                          <p className="truncate text-[11px] text-slate-400">{client.address || 'Address not provided'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-slate-400" /> {client.memberCount}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
