'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Task, Message, TaskFile } from '@/lib/types'
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  REJECTION_REASONS,
} from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { DEMO_USERS } from '@/lib/auth'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  UploadCloud,
  Send,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Sliders,
  Check,
} from 'lucide-react'

export default function EmployeeTaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [files, setFiles] = useState<TaskFile[]>([])
  const [newMessage, setNewMessage] = useState('')

  // Progress update state
  const [progressVal, setProgressVal] = useState(0)
  const [progressNote, setProgressNote] = useState('')

  // Review submission state
  const [showSubmitReviewModal, setShowSubmitReviewModal] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [deliverableFile, setDeliverableFile] = useState('')

  // Reject state
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('UNAVAILABLE')

  const loadData = () => {
    const t = TaskFlowStore.getTask(taskId)
    if (t) {
      setTask({ ...t })
      setProgressVal(t.progress_percentage)
      setMessages(TaskFlowStore.getMessages(t.id))
      setFiles(TaskFlowStore.getFiles(t.id))
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [taskId])

  const handleAccept = () => {
    if (!task) return
    TaskFlowStore.acceptTask(task.id, DEMO_USERS.employee_karthik.full_name ?? 'Expert')
    success('Task Accepted', 'Moved to In Progress. Good luck with the work!')
    loadData()
  }

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return
    TaskFlowStore.rejectTask(task.id, DEMO_USERS.employee_karthik.full_name ?? 'Expert', rejectReason)
    setShowRejectModal(false)
    success('Assignment Declined', 'Task returned to admin triage queue.')
    router.push('/employee/tasks')
  }

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return
    TaskFlowStore.updateProgress(
      task.id,
      progressVal,
      progressNote || 'Standard milestone progress update',
      DEMO_USERS.employee_karthik.full_name ?? 'Expert'
    )
    setProgressNote('')
    success('Progress Logged', `Task updated to ${progressVal}% completion.`)
    loadData()
  }

  const handleSubmitForReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!task || !reviewNotes.trim()) return

    if (deliverableFile.trim()) {
      TaskFlowStore.addFile({
        task_id: task.id,
        name: deliverableFile.trim(),
        size: '14.2 MB',
        type: 'deliverable',
        category: 'FINAL_DELIVERABLE',
        uploaded_by: DEMO_USERS.employee_karthik.full_name ?? 'Expert',
      })
    }

    TaskFlowStore.submitForReview(task.id, reviewNotes.trim(), DEMO_USERS.employee_karthik.full_name ?? 'Expert')
    setShowSubmitReviewModal(false)
    setReviewNotes('')
    setDeliverableFile('')
    success('Submitted for Review!', 'Admin operations team has been notified for quality inspection.')
    loadData()
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !task) return

    TaskFlowStore.addMessage({
      thread_id: task.id,
      sender_id: DEMO_USERS.employee_karthik.id,
      sender_name: DEMO_USERS.employee_karthik.full_name ?? 'Expert',
      sender_role: 'EMPLOYEE',
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
          <Link href="/employee/tasks" className="text-indigo-600 font-semibold text-xs mt-2 inline-block">
            ← Return to Tasks
          </Link>
        </div>
      </div>
    )
  }

  const statusColor = TASK_STATUS_COLORS[task.status] || TASK_STATUS_COLORS.DRAFT
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title={`Expert Workspace • ${task.title}`}
        subtitle={`${task.task_number} • Client: ${task.client_name} • Due ${task.end_date}`}
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/employee/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Tasks
          </Link>

          {/* Action buttons based on status */}
          <div className="flex items-center gap-2">
            {task.status === 'AWAITING_ACCEPTANCE' && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowRejectModal(true)}
                  className="text-xs"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept Task
                </Button>
              </>
            )}

            {task.status === 'IN_PROGRESS' && (
              <Button
                size="sm"
                onClick={() => setShowSubmitReviewModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Submit for Admin Review
              </Button>
            )}

            {task.status === 'REVISION_REQUIRED' && (
              <Button
                size="sm"
                onClick={() => setShowSubmitReviewModal(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Resubmit with Revisions
              </Button>
            )}
          </div>
        </div>

        {/* Revision Alert Banner */}
        {task.status === 'REVISION_REQUIRED' && (
          <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-xs text-rose-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-rose-950">Revision Instructions from Admin Reviewer:</h4>
              <p className="leading-relaxed bg-white/70 p-2.5 rounded-lg border border-rose-200">
                &quot;{task.revision_reason}&quot;
              </p>
              <p className="text-[11px] text-rose-700">
                Please make the required modifications and click &quot;Resubmit with Revisions&quot; when ready.
              </p>
            </div>
          </div>
        )}

        {/* Acceptance Banner */}
        {task.status === 'AWAITING_ACCEPTANCE' && (
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-xs text-amber-900 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">New Assignment Awaiting Your Acceptance</h4>
              <p className="mt-0.5 text-amber-800">
                Review the scope, deliverables, and deadline. Accept to add to your in-progress workload.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs whitespace-nowrap"
            >
              Accept Assignment
            </Button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Scope & Live Workspace */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Client Project Scope
                </span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                  {TASK_STATUS_LABELS[task.status]}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {task.description}
              </p>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Target Skills
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
            </Card>

            {/* In-Progress Logger & Workload Updater */}
            {['IN_PROGRESS', 'REVISION_REQUIRED'].includes(task.status) && (
              <Card padding="lg" className="border-indigo-100 bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Log Progress & Milestone Status
                  </h3>
                </div>

                <form onSubmit={handleSaveProgress} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Completion Percentage:</span>
                      <span className="text-indigo-600 font-bold">{progressVal}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={progressVal}
                      onChange={e => setProgressVal(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Progress Milestone Note:</label>
                    <input
                      type="text"
                      placeholder="e.g. Completed initial API schemas and test suite..."
                      value={progressNote}
                      onChange={e => setProgressNote(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                      Update Progress
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Conversation Thread */}
            <Card padding="none" className="border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">Project Messages (Client & Team)</h4>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No messages yet.</p>
                ) : (
                  messages.map(m => {
                    const isMe = m.sender_role === 'EMPLOYEE'
                    return (
                      <div key={m.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span className="font-bold text-slate-800">{m.sender_name}</span>
                            <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Post update or question to client..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" size="sm" className="bg-indigo-600 text-white text-xs">
                  <Send className="w-3 h-3 mr-1" /> Send
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column: Files & Metadata */}
          <div className="space-y-6">
            <Card padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-3 text-xs text-slate-600">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">
                Assignment Details
              </span>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Client:</span>
                <span className="font-bold text-slate-900">{task.client_name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Priority:</span>
                <span className={`px-2 py-0.5 rounded-full font-semibold border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border}`}>
                  {PRIORITY_LABELS[task.priority]}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Target Deadline:</span>
                <span className="font-medium text-slate-900">{task.end_date}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Progress:</span>
                <span className="font-bold text-indigo-600">{task.progress_percentage}%</span>
              </div>
            </Card>

            {/* Deliverables Files */}
            <Card padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Attached Files ({files.length})
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {files.length === 0 ? (
                  <p className="text-slate-400 py-3 text-center">No files uploaded.</p>
                ) : (
                  files.map(f => (
                    <div key={f.id} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-medium text-slate-800 truncate max-w-[140px]">{f.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{f.size}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Submit For Review Modal */}
        {showSubmitReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  {task.status === 'REVISION_REQUIRED' ? 'Resubmit with Revisions' : 'Submit Work for Admin Review'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Provide notes on how requirements were satisfied and link deliverable package names.
              </p>

              <form onSubmit={handleSubmitForReview} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Deliverable Filename / URL:</label>
                  <input
                    type="text"
                    placeholder="e.g. mobile_checkout_v2_bundle.zip or Figma Prototype Link"
                    value={deliverableFile}
                    onChange={e => setDeliverableFile(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Deliverable Summary & Notes:</label>
                  <textarea
                    rows={4}
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    placeholder="Describe completed features, testing performed, and key assets included..."
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button variant="secondary" onClick={() => setShowSubmitReviewModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                    Confirm Submission
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Decline Assignment Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Decline Task Assignment</h3>
              <p className="text-xs text-slate-500">
                Let operations know why you are unable to take on this assignment.
              </p>
              <form onSubmit={handleReject} className="space-y-4">
                <select
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {REJECTION_REASONS.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="danger" className="text-xs">
                    Decline Task
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
