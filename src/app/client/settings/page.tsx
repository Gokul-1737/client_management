'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { Bell, Lock, Globe, Shield, Moon, Eye } from 'lucide-react'

export default function ClientSettingsPage() {
  const { success } = useToast()
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [deliveryNotifications, setDeliveryNotifications] = useState(true)
  const [expertUpdates, setExpertUpdates] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  const handleSave = () => {
    success('Settings Saved', 'Your workspace preferences have been saved.')
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Workspace Preferences & Settings"
        subtitle="Configure notifications, security protocols, and platform preferences"
      />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        {/* Notifications Settings */}
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-xs text-slate-500">Choose when and how TaskFlow AI notifies your team</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Deliverable Ready Alerts',
                desc: 'Instant alert when expert submits final deliverables for your inspection',
                checked: deliveryNotifications,
                toggle: () => setDeliveryNotifications(!deliveryNotifications),
              },
              {
                title: 'Expert Work Progress Updates',
                desc: 'Receive milestone progress and percentage completion emails',
                checked: expertUpdates,
                toggle: () => setExpertUpdates(!expertUpdates),
              },
              {
                title: 'Daily Digest & Task Summary',
                desc: 'Morning rollup of all active projects, deadlines, and pending tasks',
                checked: emailAlerts,
                toggle: () => setEmailAlerts(!emailAlerts),
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={item.toggle}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Security Settings */}
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security & Authentication</h3>
              <p className="text-xs text-slate-500">Protect client data and team accounts</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</h4>
              <p className="text-[11px] text-slate-500">Require an authenticator code on each sign in</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={() => setTwoFactorAuth(!twoFactorAuth)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
            Save Preferences
          </Button>
        </div>
      </main>
    </div>
  )
}
