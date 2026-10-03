'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Task } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import {
  BrainCircuit,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Shield,
} from 'lucide-react'

export default function AdminIncomingTasksPage() {
  const { success } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedExpertId, setSelectedExpertId] = useState('')
  const [employees, setEmployees] = useState<any[]>([])

  const loadData = () => {
    const all = TaskFlowStore.getTasks()
    setTasks(all.filter(t => ['SUBMITTED', 'ANALYZING'].includes(t.status) || !t.assigned_employee_id))
    setEmployees(TaskFlowStore.getEmployees())
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const handleAssign = (taskId: string, empId: string, empName: string) => {
    TaskFlowStore.assignTask(taskId, empId, 'Operations Admin')
    success('Expert Assigned', `Task routed to ${empName}. Notification dispatched.`)
    setSelectedTask(null)
    loadData()
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Incoming Task Triage & Automated Routing"
        subtitle="Review incoming client requests and confirm automated AI expert recommendations"
      />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              Pending Incoming Requests ({tasks.length})
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Incoming Queue Clear!</h3>
            <p className="text-xs text-slate-500">
              All client requests have been assigned to experts and are progressing smoothly.
            </p>
            <Link href="/admin/tasks">
              <Button size="sm" variant="secondary" className="text-xs mt-2">
                View All Active Tasks
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => {
              const recommendation = TaskFlowStore.calculateBestExpertMatch(task)

              return (
                <Card key={task.id} padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {task.task_number}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {task.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                        <span className="text-slate-600 font-medium">Client: {task.client_name}</span>
                        <span>•</span>
                        <span>Deadline: {task.end_date}</span>
                        <span>•</span>
                        <span>Priority: {task.priority}</span>
                      </div>
                    </div>

                    {/* AI Scoring Box */}
                    {recommendation && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center gap-3 min-w-[260px]">
                          <Avatar
                            name={recommendation.employee.name}
                            src={recommendation.employee.avatar}
                            size="md"
                          />
                          <div className="text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">
                                {recommendation.employee.name}
                              </span>
                              <span className="text-[10px] font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                                {recommendation.score}% Match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">{recommendation.employee.title}</p>
                            <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                              {recommendation.reasons[0] || 'High skill compatibility'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAssign(
                                task.id,
                                recommendation.employee.profile_id,
                                recommendation.employee.name
                              )
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs whitespace-nowrap"
                          >
                            <UserCheck className="w-3.5 h-3.5 mr-1" /> Confirm Match
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                            className="text-xs whitespace-nowrap"
                          >
                            Choose Other
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Manual Reassignment Modal */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Manual Expert Assignment • {selectedTask.task_number}
              </h3>
              <p className="text-xs text-slate-500">
                Select an expert manually from the available team roster for &quot;{selectedTask.title}&quot;.
              </p>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {employees.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedExpertId(emp.profile_id)}
                    className={`p-3 flex items-center justify-between cursor-pointer rounded-lg transition-colors ${
                      selectedExpertId === emp.profile_id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} src={emp.avatar} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                        <p className="text-[11px] text-slate-500">{emp.title}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-semibold text-slate-700">{emp.workload_percentage}% Workload</span>
                      <p className="text-[10px] text-slate-400">{emp.availability_status}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="secondary" onClick={() => setSelectedTask(null)}>
                  Cancel
                </Button>
                <Button
                  disabled={!selectedExpertId}
                  onClick={() => {
                    const emp = employees.find(e => e.profile_id === selectedExpertId)
                    if (emp) handleAssign(selectedTask.id, emp.profile_id, emp.name)
                  }}
                  className="bg-indigo-600 text-white font-medium text-xs"
                >
                  Assign Selected Expert
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
