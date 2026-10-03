'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Notification } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, CheckCheck, Sparkles } from 'lucide-react'
import { DEMO_USERS } from '@/lib/auth'

export default function EmployeeNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const currentEmployeeId = DEMO_USERS.employee_karthik.id

  const loadData = () => {
    setNotifications(TaskFlowStore.getNotifications(currentEmployeeId))
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const markAllRead = () => {
    TaskFlowStore.markAllNotificationsRead(currentEmployeeId)
    loadData()
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Expert Notifications Center"
        subtitle="Stay updated on new task assignments, admin review feedback, and project milestones"
      />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            {notifications.filter(n => !n.read).length} Unread Notifications
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllRead}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark All Read
          </Button>
        </div>

        <Card padding="none" className="border-slate-200/80 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <p className="p-12 text-center text-xs text-slate-400">No notifications yet.</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  TaskFlowStore.markNotificationRead(n.id)
                  if (n.task_id) router.push(`/employee/tasks/${n.task_id}`)
                }}
                className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                  !n.read ? 'bg-indigo-50/40' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    !n.read ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </Card>
      </main>
    </div>
  )
}
