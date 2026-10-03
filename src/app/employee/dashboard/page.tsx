'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Task } from '@/lib/types'
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { DEMO_USERS } from '@/lib/auth'
import {
  Briefcase,
  CheckCircle2,
  Clock,
  RotateCcw,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export default function EmployeeDashboardPage() {
  const router = useRouter()
  const { success } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])

  const currentEmployeeId = DEMO_USERS.employee_karthik.id

  const loadData = () => {
    const all = TaskFlowStore.getTasks()
    setTasks(all.filter(t => t.assigned_employee_id === currentEmployeeId))
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const pendingAcceptance = tasks.filter(t => t.status === 'AWAITING_ACCEPTANCE')
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS')
  const revisionRequired = tasks.filter(t => t.status === 'REVISION_REQUIRED')
  const inReview = tasks.filter(t => ['SUBMITTED_FOR_REVIEW', 'RESUBMITTED'].includes(t.status))

  const handleAcceptTask = (taskId: string) => {
    TaskFlowStore.acceptTask(taskId, DEMO_USERS.employee_karthik.full_name ?? 'Expert')
    success('Task Accepted', 'Task moved to In Progress. Time to build!')
    loadData()
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Expert Workspace Dashboard"
        subtitle={`Welcome back, ${DEMO_USERS.employee_karthik.full_name} • Senior Full Stack Engineer`}
      />

      <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Banner with Workload */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-700 via-indigo-700 to-indigo-600 p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-indigo-100 backdrop-blur-sm inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> High-Priority Assignments
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {inProgress.length} Tasks Actively in Progress
              </h2>
              <p className="text-indigo-100 text-xs leading-relaxed">
                Keep your deliverables on schedule. Submit progress updates regularly for client tracking.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 min-w-[200px] text-center">
              <span className="text-xs text-indigo-200">Current Workload</span>
              <p className="text-2xl font-bold text-white mt-1">45%</p>
              <span className="text-[10px] text-emerald-300 font-semibold">Available for new tasks</span>
            </div>
          </div>
        </div>

        {/* Urgent Attention: Revision Requests */}
        {revisionRequired.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-rose-950">
                Action Required: Admin Requested Revision ({revisionRequired.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {revisionRequired.map(task => (
                <div key={task.id} className="p-4 bg-white rounded-xl border border-rose-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600">{task.task_number}</span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Revision Needed
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                    &quot;{task.revision_reason}&quot;
                  </p>
                  <div className="pt-1 flex justify-end">
                    <Link href={`/employee/tasks/${task.id}`}>
                      <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs">
                        Open & Resubmit Work
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Acceptance Queue */}
        {pendingAcceptance.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-950">
                  New Task Assignments Awaiting Your Acceptance ({pendingAcceptance.length})
                </h3>
              </div>
              <span className="text-xs text-amber-800 font-medium">Review scope and accept assignment</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingAcceptance.map(task => (
                <div key={task.id} className="p-4 bg-white rounded-xl border border-amber-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600">{task.task_number}</span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {task.match_score || 95}% AI Skill Match
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <Link href={`/employee/tasks/${task.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        Review Scope
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptTask(task.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept Task
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active In-Progress Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Active In-Progress Tasks</h3>
              <p className="text-xs text-slate-500">Update percentage progress and submit deliverables when completed</p>
            </div>
            <Link
              href="/employee/tasks"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              All assigned tasks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgress.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center col-span-2">
                No active in-progress tasks right now.
              </p>
            ) : (
              inProgress.map(task => {
                const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM

                return (
                  <Card key={task.id} padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {task.task_number}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border}`}
                        >
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">Due {task.end_date}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{task.description}</p>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Progress:</span>
                        <span className="font-bold text-indigo-600">{task.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${task.progress_percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                      <Link href={`/employee/tasks/${task.id}`}>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                          Workspace & Deliverables →
                        </Button>
                      </Link>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
