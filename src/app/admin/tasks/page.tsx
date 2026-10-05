'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Task, TaskStatus } from '@/lib/types'
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Search, Filter, Calendar, Clock, Plus, LayoutGrid, List } from 'lucide-react'

export default function AdminTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')

  const loadData = () => {
    setTasks(TaskFlowStore.getTasks())
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
      t.task_number.toLowerCase().includes(search.toLowerCase()) ||
      (t.client_name && t.client_name.toLowerCase().includes(search.toLowerCase())) ||
      (t.assigned_employee?.name && t.assigned_employee.name.toLowerCase().includes(search.toLowerCase()))

    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter

    return matchSearch && matchStatus && matchPriority
  })

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="All Projects & Task Directory"
        subtitle="Global cross-organization repository of all submitted, in-progress, and delivered tasks"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all client tasks, experts, IDs..."
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
              <option value="SUBMITTED">Submitted / Triage</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED_FOR_REVIEW">Awaiting Review</option>
              <option value="REVISION_REQUIRED">Revision Required</option>
              <option value="FINAL_DELIVERY">Final Delivery Ready</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="h-10 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <Link href="/admin/tasks/incoming">
            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs">
              Incoming Triage Queue
            </Button>
          </Link>
        </div>

        {/* Global Tasks Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Task ID & Title</th>
                  <th className="py-3 px-4">Client Org</th>
                  <th className="py-3 px-4">Assigned Expert</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progress</th>
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
                      onClick={() => router.push(`/admin/tasks/${task.id}`)}
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
                        {task.client_name || 'Client organization'}
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
                          <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Unassigned
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

                      <td className="py-3.5 px-4 w-32">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-medium text-slate-500">
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

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                          onClick={e => {
                            e.stopPropagation()
                            router.push(`/admin/tasks/${task.id}`)
                          }}
                        >
                          Manage →
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
