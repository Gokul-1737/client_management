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
import { DEMO_USERS } from '@/lib/auth'
import { Search, Filter, Calendar, Clock, ArrowRight } from 'lucide-react'

export default function EmployeeTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

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

  const filteredTasks = tasks.filter(t => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.task_number.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="My Assigned Tasks & Deliverable Pipeline"
        subtitle="Manage assigned projects, review briefs, log daily progress, and upload deliverables"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your assigned tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AWAITING_ACCEPTANCE">Awaiting Acceptance</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUBMITTED_FOR_REVIEW">Under Review</option>
            <option value="REVISION_REQUIRED">Revision Required</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Task ID & Title</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Target Due</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map(task => {
                const statusColor = TASK_STATUS_COLORS[task.status] || TASK_STATUS_COLORS.DRAFT
                const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => router.push(`/employee/tasks/${task.id}`)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {task.task_number}
                        </span>
                        <span className="truncate max-w-sm">{task.title}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {task.client_name}
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

                    <td className="py-3.5 px-4 w-32">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>{task.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${task.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {task.end_date}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        onClick={e => {
                          e.stopPropagation()
                          router.push(`/employee/tasks/${task.id}`)
                        }}
                      >
                        Workspace →
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
