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
import {
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react'

export default function ClientDashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])

  const loadData = () => {
    setTasks(TaskFlowStore.getTasks())
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const activeTasks = tasks.filter(t => !['COMPLETED', 'CLOSED'].includes(t.status))
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS')
  const readyForReviewOrDelivery = tasks.filter(t => ['SUBMITTED_FOR_REVIEW', 'FINAL_DELIVERY'].includes(t.status))
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED')

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Client Overview"
        subtitle="Track active requests, review deliverables, and submit new project briefs"
      />

      <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Welcome Banner with Quick Action */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-6 md:p-8 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-indigo-100 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Automated Skill & Expert Routing Active</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Welcome back, Acme Corp
              </h2>
              <p className="text-indigo-100 text-sm leading-relaxed">
                You have <span className="font-semibold text-white">{readyForReviewOrDelivery.length} deliverables</span> awaiting review or final acceptance.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/client/tasks/new">
                <Button className="h-11 px-5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-md hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4 mr-2 text-indigo-700" />
                  Create New Task
                </Button>
              </Link>
            </div>
          </div>
          {/* Subtle background ambient circles */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="border-slate-200/80 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Requests</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{activeTasks.length}</span>
              <span className="text-xs text-slate-500 font-medium">in queue & progress</span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{inProgress.length}</span>
              <span className="text-xs text-blue-600 font-medium font-semibold">Active work</span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Acceptance</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{readyForReviewOrDelivery.length}</span>
              <span className="text-xs text-amber-600 font-medium">Ready for download</span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Projects</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{completedTasks.length}</span>
              <span className="text-xs text-emerald-600 font-medium">Successfully delivered</span>
            </div>
          </Card>
        </div>

        {/* Ready for Acceptance Spotlight */}
        {readyForReviewOrDelivery.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Action Required: Ready for Review & Final Delivery Acceptance
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {readyForReviewOrDelivery.map(item => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-xl border border-amber-200/70 shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600">{item.task_number}</span>
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Deliverables ready from {item.assigned_employee?.name || 'Assigned Expert'}
                    </p>
                  </div>
                  <Link href={`/client/tasks/${item.id}`}>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                      Inspect & Complete
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Table Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Task Requests</h3>
              <p className="text-xs text-slate-500">Overview of all submitted briefs and their current stage</p>
            </div>
            <Link
              href="/client/tasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all tasks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Task ID & Title</th>
                    <th className="py-3 px-4">Assigned Expert</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.slice(0, 6).map(task => {
                    const statusColor = TASK_STATUS_COLORS[task.status] || TASK_STATUS_COLORS.DRAFT
                    const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM

                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => router.push(`/client/tasks/${task.id}`)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {task.task_number}
                            </span>
                            <span className="truncate max-w-xs">{task.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                            {task.description}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          {task.assigned_employee ? (
                            <div className="flex items-center gap-2">
                              <Avatar
                                name={task.assigned_employee.name}
                                src={task.assigned_employee.avatar}
                                size="xs"
                              />
                              <div>
                                <p className="font-medium text-slate-800">{task.assigned_employee.name}</p>
                                <p className="text-[10px] text-slate-400">{task.assigned_employee.title}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 italic">
                              <Clock className="w-3 h-3" /> Auto-Routing
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border}`}
                          >
                            {PRIORITY_LABELS[task.priority]}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                            {TASK_STATUS_LABELS[task.status]}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 w-36">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-medium text-slate-500">
                              <span>Progress</span>
                              <span>{task.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${task.progress_percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{task.end_date || 'No deadline'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            onClick={e => {
                              e.stopPropagation()
                              router.push(`/client/tasks/${task.id}`)
                            }}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
