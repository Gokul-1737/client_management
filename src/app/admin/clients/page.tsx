'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Plus, Mail, Globe, ArrowRight } from 'lucide-react'

export default function AdminClientsPage() {
  const clients = [
    {
      id: 'c-1',
      name: 'Acme Corporation',
      contact: 'Sarah Jenkins (sarah@acme.com)',
      industry: 'Enterprise Software & FinTech',
      activeTasks: 4,
      totalDelivered: 18,
      status: 'Active Premium',
    },
    {
      id: 'c-2',
      name: 'Apex Media Group',
      contact: 'David Kim (david@apexmedia.com)',
      industry: 'Digital Content & Streaming',
      activeTasks: 2,
      totalDelivered: 12,
      status: 'Active Standard',
    },
    {
      id: 'c-3',
      name: 'Synthetix Dynamics',
      contact: 'Elena R. (elena@synthetix.io)',
      industry: 'Robotics & Automation',
      activeTasks: 1,
      totalDelivered: 7,
      status: 'Active Enterprise',
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Client Organization Directory"
        subtitle="Manage client enterprise accounts, contract tiers, and project delivery histories"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Primary Contact</th>
                <th className="py-3 px-4">Active Tasks</th>
                <th className="py-3 px-4">Completed Deliverables</th>
                <th className="py-3 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{client.industry}</td>
                  <td className="py-3.5 px-4 text-slate-600">{client.contact}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-indigo-600">{client.activeTasks} active</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{client.totalDelivered} projects</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
