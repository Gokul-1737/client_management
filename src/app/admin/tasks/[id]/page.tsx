'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Task, TaskStatus, Message, TaskFile, ActivityLog } from '@/lib/types'
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  TIMELINE_STEPS,
  STATUS_ORDER,
} from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  Download,
  FileText,
  MessageSquare,
  Send,
  History,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export default function AdminTaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [files, setFiles] = useState<TaskFile[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  const [newMessage, setNewMessage] = useState('')
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [revisionReason, setRevisionReason] = useState('')
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [newEmployeeId, setNewEmployeeId] = useState('')

  const loadData = () => {
    const t = TaskFlowStore.getTask(taskId)
    if (t) {
      setTask({ ...t })
      setMessages(TaskFlowStore.getMessages(t.id))
      setFiles(TaskFlowStore.getFiles(t.id))
      setActivities(TaskFlowStore.getActivities(t.id))
      setEmployees(TaskFlowStore.getEmployees())
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [taskId])

  const handleApprove = () => {
    if (!task) return
    TaskFlowStore.adminApproveReview(task.id, 'Alex Rivera (Operations Admin)')
    success('Deliverables Approved!', 'Task moved to Final Delivery. Client notified to download deliverables.')
    loadData()
  }

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault()
    if (!revisionReason.trim() || !task) return

    TaskFlowStore.adminRequestRevision(task.id, revisionReason.trim(), 'Alex Rivera')
    setShowRevisionModal(false)
    setRevisionReason('')
    success('Revision Dispatched', 'Assigned expert has been notified to make adjustments and resubmit.')
    loadData()
  }

  const handleReassign = () => {
    if (!task || !newEmployeeId) return
    const emp = employees.find(e => e.profile_id === newEmployeeId)
    if (emp) {
      TaskFlowStore.assignTask(task.id, emp.profile_id, 'Alex Rivera')
      success('Reassignment Complete', `Assigned task to ${emp.name}`)
      setShowReassignModal(false)
      loadData()
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !task) return

    TaskFlowStore.addMessage({
      thread_id: task.id,
      sender_id: 'admin-alex',
      sender_name: 'Alex Rivera (Admin)',
      sender_role: 'ADMIN',
      content: newMessage.trim(),
    })

    setNewMessage('')
    setMessages(TaskFlowStore.getMessages(task.id))
  }

  if (!task) {
    return (
      <div className="flex-1 flex flex-col">
        <PortalHeader title="Task Not Found" />
        <div className="p-12 text-center text-slate-500">
          <p>Requested task could not be loaded.</p>
          <Link href="/admin/tasks" className="text-indigo-600 font-semibold text-xs mt-2 inline-block">
            ← Return to Tasks
          </Link>
        </div>
      </div>
    )
  }

  const statusColor = TASK_STATUS_COLORS[task.status] || TASK_STATUS_COLORS.DRAFT
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM
  const isAwaitingReview = ['SUBMITTED_FOR_REVIEW', 'RESUBMITTED'].includes(task.status)

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title={`Admin Review • ${task.title}`}
        subtitle={`${task.task_number} • Client: ${task.client_name}`}
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Navigation & Urgent Action Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/admin/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Project Directory
          </Link>

          {/* Review Actions if Under Review */}
          {isAwaitingReview && (
            <div className="flex items-center gap-3">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRevisionModal(true)}
                className="text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Request Revision
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Approve & Unlock Client Delivery
              </Button>
            </div>
          )}
        </div>

        {/* Highlight Review Notice if awaiting review */}
        {isAwaitingReview && (
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                  Review & Quality Assurance Stage
                </h4>
              </div>
              <p className="text-xs text-indigo-950">
                Deliverables submitted by <span className="font-semibold">{task.assigned_employee?.name}</span>.
                Notes: &quot;{task.submission_notes || 'All requirements implemented'}&quot;
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Approve Now
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowRevisionModal(true)}
                className="text-xs"
              >
                Request Revision
              </Button>
            </div>
          </div>
        )}

        {/* Revision Alert if in revision */}
        {task.status === 'REVISION_REQUIRED' && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 text-xs text-rose-900 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Revision Requested:</p>
              <p className="mt-0.5">{task.revision_reason}</p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Details & Deliverables */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Task Specification
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border}`}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{task.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                  {task.description}
                </p>
              </div>

              {/* Skills */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Required Skill Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {task.required_skills?.map(skill => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverable Files Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Associated Files & Deliverables ({files.length})
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {files.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">No files attached to this task.</p>
                  ) : (
                    files.map(f => (
                      <div key={f.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{f.name}</p>
                            <p className="text-[10px] text-slate-400">{f.size} • Category: {f.category}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => success('Download started', `Downloading ${f.name}`)}
                          className="text-xs text-indigo-600"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" /> Download
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            {/* Conversation Thread */}
            <Card padding="none" className="border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">Task Communications Audit</h4>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No messages recorded.</p>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-800">{m.sender_name} ({m.sender_role})</span>
                        <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700">{m.content}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Post administrative note or reply..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" size="sm" className="bg-indigo-600 text-white text-xs">
                  <Send className="w-3 h-3 mr-1" /> Post
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column: Expert Assignment & Action Controls */}
          <div className="space-y-6">
            {/* Assigned Expert Box */}
            <Card padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Assigned Expert
                </span>
                <button
                  onClick={() => setShowReassignModal(true)}
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-800"
                >
                  Change Expert
                </button>
              </div>

              {task.assigned_employee ? (
                <div className="flex items-center gap-3">
                  <Avatar name={task.assigned_employee.name} src={task.assigned_employee.avatar} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{task.assigned_employee.name}</h4>
                    <p className="text-[11px] text-slate-500">{task.assigned_employee.title}</p>
                    <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                      {task.assigned_employee.workload_percentage}% workload
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-xs text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-semibold">Unassigned</p>
                  <Button
                    size="sm"
                    onClick={() => setShowReassignModal(true)}
                    className="mt-2 bg-indigo-600 text-white text-xs"
                  >
                    Assign Expert Now
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Status Override Card */}
            <Card padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Administrative Controls
              </span>
              <div className="space-y-2">
                <label className="text-[11px] text-slate-500 font-medium">Override Lifecycle Status:</label>
                <select
                  value={task.status}
                  onChange={e => {
                    TaskFlowStore.updateTaskStatus(task.id, e.target.value as TaskStatus, 'Admin override')
                    success('Status Updated', `Task moved to ${e.target.value}`)
                    loadData()
                  }}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="ANALYZING">ANALYZING</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="AWAITING_ACCEPTANCE">AWAITING_ACCEPTANCE</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="SUBMITTED_FOR_REVIEW">SUBMITTED_FOR_REVIEW</option>
                  <option value="REVISION_REQUIRED">REVISION_REQUIRED</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="FINAL_DELIVERY">FINAL_DELIVERY</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </Card>

            {/* Audit Activity Trail */}
            <Card padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <History className="w-3.5 h-3.5" />
                <span>Lifecycle Audit Trail</span>
              </div>
              <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
                {activities.map(act => (
                  <div key={act.id} className="pt-2 first:pt-0">
                    <p className="text-slate-800 font-medium">{act.description}</p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.actor_name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Request Revision Modal */}
        {showRevisionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-600">
                <RotateCcw className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">Request Work Revision</h3>
              </div>
              <p className="text-xs text-slate-600">
                Specify exact adjustments or missing requirements for the assigned expert before client delivery.
              </p>
              <form onSubmit={handleRequestRevision} className="space-y-4">
                <textarea
                  rows={4}
                  value={revisionReason}
                  onChange={e => setRevisionReason(e.target.value)}
                  placeholder="Detail the corrections needed (e.g. adjust logo animation, fix responsive layout, update copy)..."
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setShowRevisionModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="danger" className="text-xs font-medium">
                    Send Revision Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reassign Expert Modal */}
        {showReassignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Assign or Reassign Expert</h3>
              <p className="text-xs text-slate-500">
                Select an expert to take over &quot;{task.title}&quot;.
              </p>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {employees.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => setNewEmployeeId(emp.profile_id)}
                    className={`p-3 flex items-center justify-between cursor-pointer rounded-lg ${
                      newEmployeeId === emp.profile_id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar name={emp.name} src={emp.avatar} size="xs" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.title}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">{emp.workload_percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setShowReassignModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReassign} className="bg-indigo-600 text-white text-xs">
                  Confirm Assignment
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
