'use client'

import React, { useState, useEffect } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { ActivityLog } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { History, Shield, CheckCircle, Clock } from 'lucide-react'

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([])

  useEffect(() => {
    setActivities(TaskFlowStore.getActivities())
    const handleUpdate = () => setActivities(TaskFlowStore.getActivities())
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Global System Activity & Audit Trail"
        subtitle="Immutable transaction log of all task submissions, assignments, reviews, and status changes"
      />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <Card padding="none" className="border-slate-200/80 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
          {activities.length === 0 ? (
            <p className="p-12 text-center text-xs text-slate-400">No activity logged yet.</p>
          ) : (
            activities.map(act => (
              <div key={act.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <History className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{act.action}</span>
                    <span className="text-[11px] text-slate-400">{new Date(act.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{act.description}</p>
                  <p className="text-[11px] text-slate-400">
                    Actor: <span className="font-medium text-slate-600">{act.actor_name}</span> ({act.actor_role})
                  </p>
                </div>
              </div>
            ))
          )}
        </Card>
      </main>
    </div>
  )
}
