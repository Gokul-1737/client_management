'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { Bell, Lock, UserCheck } from 'lucide-react'

export default function EmployeeSettingsPage() {
  const { success } = useToast()
  const [instantTaskAlerts, setInstantTaskAlerts] = useState(true)
  const [reviewAlerts, setReviewAlerts] = useState(true)

  const handleSave = () => {
    success('Preferences Saved', 'Expert workspace settings updated.')
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Expert Workspace Settings"
        subtitle="Configure assignment notifications, direct messaging alerts, and availability status"
      />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Task Notification Signals</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">New Task Assignment Alert</h4>
                <p className="text-[11px] text-slate-500">Receive immediate desktop and sound ping when admin assigns you a task</p>
              </div>
              <input
                type="checkbox"
                checked={instantTaskAlerts}
                onChange={() => setInstantTaskAlerts(!instantTaskAlerts)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Review & Revision Directives</h4>
                <p className="text-[11px] text-slate-500">Alerts when admin approves your work or requests targeted revisions</p>
              </div>
              <input
                type="checkbox"
                checked={reviewAlerts}
                onChange={() => setReviewAlerts(!reviewAlerts)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
              Save Settings
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
