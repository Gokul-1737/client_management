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
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  ArrowRight,
  FolderOpen,
  Trash2,
} from 'lucide-react'

export default function ClientTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')

  const loadData = () => {
    setTasks(TaskFlowStore.getTasks())
  }

  const handleDeleteTask = (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return
    if (TaskFlowStore.deleteTask(task.id)) {
      loadData()
    }
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
      t.description?.toLowerCase().includes(search.toLowerCase())

    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter

    return matchSearch && matchStatus && matchPriority
  })

  // Kanban Columns
  const kanbanColumns: Array<{ title: string; statuses: TaskStatus[]; color: string }> = [
    { title: 'Submitted & Queued', statuses: ['SUBMITTED', 'ANALYZING', 'ASSIGNED', 'AWAITING_ACCEPTANCE'], color: 'border-blue-500' },
    { title: 'In Active Progress', statuses: ['ACCEPTED', 'IN_PROGRESS'], color: 'border-indigo-500' },
    { title: 'Under Review & Delivery', statuses: ['SUBMITTED_FOR_REVIEW', 'REVISION_REQUIRED', 'RESUBMITTED', 'APPROVED', 'FINAL_DELIVERY'], color: 'border-amber-500' },
    { title: 'Completed', statuses: ['COMPLETED', 'CLOSED'], color: 'border-emerald-500' },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="My Tasks & Deliverables"
        subtitle="Manage all active project requests, milestones, and deliverable reviews"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search & Filters */}
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks, deliverables, IDs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-10 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED_FOR_REVIEW">Under Review</option>
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

          {/* View Toggle & New Task */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded text-xs flex items-center gap-1.5 font-medium transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            <Link href="/client/tasks/new">
              <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs">
                <Plus className="w-4 h-4 mr-1.5" />
                New Task Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No Tasks Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No project requests match your current search or filter criteria.
              </p>
            </div>
            <Link href="/client/tasks/new">
              <Button size="sm" className="bg-indigo-600 text-white font-medium text-xs">
                Create First Task
              </Button>
            </Link>
          </div>
        ) : viewMode === 'list' ? (
          /* List View Table */
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
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-right">Action</th>
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
                        onClick={() => router.push(`/client/tasks/${task.id}`)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {task.task_number}
                            </span>
                            <span className="truncate max-w-sm">{task.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-md mt-0.5">
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
                            <span className="text-[11px] text-slate-400 italic">Auto-Routing in progress</span>
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
                          {task.end_date || 'No deadline'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                              onClick={e => {
                                e.stopPropagation()
                                router.push(`/client/tasks/${task.id}`)
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              aria-label={`Delete ${task.title}`}
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={e => {
                                e.stopPropagation()
                                handleDeleteTask(task)
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Kanban Board View (Stitch: Screen 27) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {kanbanColumns.map((col, idx) => {
              const colTasks = filteredTasks.filter(t => col.statuses.includes(t.status))

              return (
                <div key={idx} className="flex flex-col space-y-3 bg-slate-100/60 rounded-xl p-3.5 border border-slate-200/80 min-h-[500px]">
                  <div className={`flex items-center justify-between border-t-2 ${col.color} pt-2`}>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{col.title}</h4>
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                        {colTasks.length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colTasks.map(task => {
                      const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM
                      const statusColor = TASK_STATUS_COLORS[task.status] || TASK_STATUS_COLORS.DRAFT

                      return (
                        <Card
                          key={task.id}
                          padding="sm"
                          hover
                          className="bg-white border-slate-200/90 shadow-sm cursor-pointer space-y-3"
                          onClick={() => router.push(`/client/tasks/${task.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {task.task_number}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border}`}
                            >
                              {PRIORITY_LABELS[task.priority]}
                            </span>
                          </div>

                          <div>
                            <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{task.title}</h5>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                              {task.description}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Progress</span>
                              <span className="font-semibold">{task.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ width: `${task.progress_percentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                            {task.assigned_employee ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar
                                  name={task.assigned_employee.name}
                                  src={task.assigned_employee.avatar}
                                  size="xs"
                                />
                                <span className="font-medium text-slate-700 truncate max-w-[90px]">
                                  {task.assigned_employee.name}
                                </span>
                              </div>
                            ) : (
                              <span className="italic text-slate-400">Unassigned</span>
                            )}
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{task.end_date?.slice(5) || 'TBD'}</span>
                              </div>
                              <button
                                type="button"
                                aria-label={`Delete ${task.title}`}
                                className="rounded p-1 text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                                onClick={event => {
                                  event.stopPropagation()
                                  handleDeleteTask(task)
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
