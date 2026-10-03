'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Task, EmployeeProfile } from '@/lib/types'
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import {
  Inbox,
  CheckCircle,
  Clock,
  Users,
  BrainCircuit,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Sparkles,
  AlertTriangle,
  Play,
  UserCheck,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { success } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  const loadData = () => {
    setTasks(TaskFlowStore.getTasks())
    setEmployees(TaskFlowStore.getEmployees())
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  // Derived queues
  const pendingAssignment = tasks.filter(t => ['SUBMITTED', 'ANALYZING'].includes(t.status) || !t.assigned_employee_id)
  const pendingReview = tasks.filter(t => ['SUBMITTED_FOR_REVIEW', 'RESUBMITTED'].includes(t.status))
  const inProgress = tasks.filter(t => ['IN_PROGRESS', 'AWAITING_ACCEPTANCE'].includes(t.status))
  const completed = tasks.filter(t => t.status === 'COMPLETED')

  // Auto-assign all pending tasks
  const handleAutoAssignAll = () => {
    let count = 0
    pendingAssignment.forEach(task => {
      const match = TaskFlowStore.calculateBestExpertMatch(task)
      if (match) {
        TaskFlowStore.assignTask(task.id, match.employee.profile_id, 'TaskFlow AI Auto-Router')
        count++
      }
    })
    success('Auto-Assignment Complete', `Successfully routed ${count} tasks to optimal experts.`)
    loadData()
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Admin Operations Command Center"
        subtitle="Manage automated expert routing, review submitted deliverables, and monitor team workload"
      />

      <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Assignment</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{pendingAssignment.length}</span>
              <span className="text-xs text-amber-600 font-medium font-semibold">Needs Expert</span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Review</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-600">{pendingReview.length}</span>
              <span className="text-xs text-slate-500 font-medium">Ready for approval</span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active In Progress</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{inProgress.length}</span>
              <span className="text-xs text-blue-600 font-medium">Under active work</span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Experts</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{employees.length}</span>
              <span className="text-xs text-emerald-600 font-medium">Avg capacity 52%</span>
            </div>
          </Card>
        </div>

        {/* Action Priority Queue: Tasks Awaiting Review (Admin Approval Stage) */}
        {pendingReview.length > 0 && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Critical Action: Deliverables Submitted for Admin Review ({pendingReview.length})
                </h3>
              </div>
              <span className="text-xs text-indigo-700 font-medium">Verify deliverables before client delivery</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingReview.map(task => (
                <div
                  key={task.id}
                  className="p-4 bg-white rounded-xl border border-indigo-200 shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600">{task.task_number}</span>
                      <span className="text-xs font-bold text-slate-900">{task.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Expert: {task.assigned_employee?.name || 'Assigned Expert'} • Client: {task.client_name}
                    </p>
                    {task.submission_notes && (
                      <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded line-clamp-1">
                        &quot;{task.submission_notes}&quot;
                      </p>
                    )}
                  </div>
                  <Link href={`/admin/tasks/${task.id}`}>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs ml-3">
                      Review Work
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incoming & Pending Assignment Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Incoming Tasks Needing Expert Assignment</h3>
              <p className="text-xs text-slate-500">AI algorithm has calculated candidate match scores</p>
            </div>
            <div className="flex items-center gap-2">
              {pendingAssignment.length > 0 && (
                <Button
                  onClick={handleAutoAssignAll}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
                >
                  <BrainCircuit className="w-4 h-4 mr-1.5" />
                  Auto-Assign All Best Matches
                </Button>
              )}
              <Link href="/admin/tasks/incoming">
                <Button variant="secondary" size="sm" className="text-xs font-semibold">
                  View Triage Queue →
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            {pendingAssignment.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                All submitted tasks have been assigned to experts. Queue is clear!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingAssignment.map(task => {
                  const recommendation = TaskFlowStore.calculateBestExpertMatch(task)
                  return (
                    <div
                      key={task.id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {task.task_number}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{task.title}</span>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {task.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 max-w-xl line-clamp-1">{task.description}</p>
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                          <span>Client: {task.client_name}</span>
                          <span>•</span>
                          <span>Deadline: {task.end_date}</span>
                        </div>
                      </div>

                      {/* AI Recommendation Pill */}
                      {recommendation && (
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
                            <Avatar
                              name={recommendation.employee.name}
                              src={recommendation.employee.avatar}
                              size="sm"
                            />
                            <div className="text-left text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{recommendation.employee.name}</span>
                                <span className="text-[10px] font-bold text-indigo-600 bg-white px-1.5 py-0.2 rounded border border-indigo-200">
                                  {recommendation.score}% Match
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500">
                                {recommendation.employee.title} • {recommendation.employee.workload_percentage}% workload
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => {
                              TaskFlowStore.assignTask(task.id, recommendation.employee.profile_id, 'Alex Rivera')
                              success('Expert Assigned', `Assigned ${recommendation.employee.name} to ${task.task_number}`)
                              loadData()
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs whitespace-nowrap"
                          >
                            Assign Expert
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Expert Workload & Availability Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Domain Experts & Live Workload</h3>
              <p className="text-xs text-slate-500">Real-time team bandwidth and assignment capacities</p>
            </div>
            <Link
              href="/admin/employees"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              Manage all experts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {employees.map(emp => (
              <Card key={emp.id} padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={emp.name} src={emp.avatar} size="md" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{emp.name}</h4>
                      <p className="text-[11px] text-slate-500">{emp.title}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      emp.availability_status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {emp.availability_status}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Workload Capacity</span>
                    <span className="font-bold text-slate-800">{emp.workload_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        emp.workload_percentage > 70 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${emp.workload_percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {emp.skills.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {s}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{emp.skills.length - 3}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
