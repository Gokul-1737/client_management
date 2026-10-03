'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { Settings, Shield, Bell, Database } from 'lucide-react'

export default function AdminSettingsPage() {
  const { success } = useToast()
  const [autoRouting, setAutoRouting] = useState(true)
  const [realtimeNotify, setRealtimeNotify] = useState(true)

  const handleSave = () => {
    success('Settings Updated', 'Platform administrative settings applied.')
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Admin Global System Settings"
        subtitle="Manage global application parameters, role policies, and operational defaults"
      />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Automation & Notification Directives</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Auto-Routing Dispatch Engine</h4>
                <p className="text-[11px] text-slate-500">Automatically calculate match scores upon client task submission</p>
              </div>
              <input
                type="checkbox"
                checked={autoRouting}
                onChange={() => setAutoRouting(!autoRouting)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Real-Time Event Broadcasting</h4>
                <p className="text-[11px] text-slate-500">Dispatch instant notifications on review submissions and approvals</p>
              </div>
              <input
                type="checkbox"
                checked={realtimeNotify}
                onChange={() => setRealtimeNotify(!realtimeNotify)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
              Save Platform Configuration
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
