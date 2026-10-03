'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Notification } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, CheckCheck, Clock, FileCheck2, Sparkles } from 'lucide-react'
import { DEMO_USERS } from '@/lib/auth'

export default function ClientNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL')

  const loadData = () => {
    setNotifications(TaskFlowStore.getNotifications(DEMO_USERS.client.id))
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const markRead = (id: string) => {
    TaskFlowStore.markNotificationRead(id)
    loadData()
  }

  const markAllRead = () => {
    TaskFlowStore.markAllNotificationsRead(DEMO_USERS.client.id)
    loadData()
  }

  const filteredNotifs = notifications.filter(n => (filter === 'UNREAD' ? !n.read : true))

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Notifications & Activity Center"
        subtitle="Stay informed on task milestone completions, reviewer feedback, and deliverable releases"
      />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                filter === 'ALL'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                filter === 'UNREAD'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              Unread ({notifications.filter(n => !n.read).length})
            </button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={markAllRead}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
          </Button>
        </div>

        <Card padding="none" className="border-slate-200/80 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredNotifs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No notifications to display</p>
            </div>
          ) : (
            filteredNotifs.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markRead(n.id)
                  if (n.task_id) router.push(`/client/tasks/${n.task_id}`)
                }}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                  !n.read ? 'bg-indigo-50/40' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !n.read ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      markRead(n.id)
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </Card>
      </main>
    </div>
  )
}
