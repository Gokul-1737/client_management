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
  TIMELINE_STEPS,
  STATUS_ORDER,
} from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MessageSquare,
  Send,
  UserCheck,
  Zap,
  Sparkles,
  Paperclip,
} from 'lucide-react'

export default function ClientTaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { success } = useToast()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [files, setFiles] = useState<TaskFile[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'files'>('overview')

  const loadData = () => {
    const t = TaskFlowStore.getTask(taskId)
    if (t) {
      setTask({ ...t })
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !task) return

    TaskFlowStore.addMessage({
      thread_id: task.id,
      sender_id: 'client-user',
      sender_name: 'Sarah Jenkins (Acme Corp)',
      sender_role: 'CLIENT',
      content: newMessage.trim(),
    })

    setNewMessage('')
    setMessages(TaskFlowStore.getMessages(task.id))
    success('Message sent to assigned team')
  }

  const handleCompleteTask = () => {
    if (!task) return
    TaskFlowStore.clientCompleteTask(task.id, 'Sarah Jenkins (Acme Corp)')
    success('Task Finalized!', 'Deliverables accepted and project marked Completed.')
    loadData()
  }

  if (!task) {
    return (
      <div className="flex-1 flex flex-col">
        <PortalHeader title="Task Not Found" />
        <div className="p-12 text-center text-slate-500">
          <p>The requested task was not found.</p>
          <Link href="/client/tasks" className="text-indigo-600 font-semibold text-xs mt-2 inline-block">
            ← Return to Tasks
          </Link>
        </div>
      </div>
    )
  }

  const statusColor = TASK_STATUS_COLORS[task.status] || TASK_STATUS_COLORS.DRAFT
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM
  const currentStepIndex = STATUS_ORDER[task.status] ?? 1

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title={task.title}
        subtitle={`${task.task_number} • Submitted on ${new Date(task.created_at).toLocaleDateString()}`}
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Back Link & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/client/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Tasks
          </Link>

          {task.status === 'FINAL_DELIVERY' && (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCompleteTask}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Confirm Acceptance & Complete Task
              </Button>
            </div>
          )}
        </div>

        {/* Status Pipeline Timeline Bar (Stitch: Screen 12) */}
        <Card padding="md" className="border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Project Lifecycle Status
          </div>
          <div className="flex items-center justify-between relative overflow-x-auto pb-2">
            {TIMELINE_STEPS.map((step, idx) => {
              const stepIndex = STATUS_ORDER[step.status] ?? idx + 1
              const isPast = currentStepIndex > stepIndex
              const isCurrent = currentStepIndex === stepIndex

              return (
                <div key={step.status} className="flex-1 min-w-[100px] flex flex-col items-center relative text-center">
                  {/* Connecting Line */}
                  {idx > 0 && (
                    <div
                      className={`absolute top-3 right-1/2 left-[-50%] h-0.5 z-0 ${
                        isPast || isCurrent ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                  {/* Dot */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-colors ${
                      isPast
                        ? 'bg-indigo-600 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  {/* Label */}
                  <span
                    className={`text-[11px] mt-2 font-medium ${
                      isCurrent
                        ? 'text-indigo-700 font-bold'
                        : isPast
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-indigo-600 text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Project Scope & Deliverables
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'border-b-2 border-indigo-600 text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discussion ({messages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'files'
                ? 'border-b-2 border-indigo-600 text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Files & Assets ({files.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Description & Deliverables */}
            <div className="lg:col-span-2 space-y-6">
              <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Project Brief & Specifications
                  </h3>
                  <p className="text-slate-700 text-sm mt-3 leading-relaxed whitespace-pre-line">
                    {task.description}
                  </p>
                </div>

                {/* Required Skills */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Required Skill Domains
                  </h4>
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

                {/* Deliverables / Submission Note if under review or delivered */}
                {task.submission_notes && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Submitted Deliverable Notes from Expert</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{task.submission_notes}</p>
                    </div>
                  </div>
                )}

                {/* Final Delivery Card */}
                {task.status === 'FINAL_DELIVERY' && (
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-sm font-bold text-slate-900">
                          Final Deliverables Ready for Acceptance
                        </h4>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleCompleteTask}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                      >
                        Mark Completed
                      </Button>
                    </div>
                    <p className="text-xs text-slate-600">
                      The assigned expert completed the deliverables and our admin team verified the output. You may download all files in the Files tab.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column: Expert Profile & Task Metadata */}
            <div className="space-y-6">
              {/* Assigned Expert Card */}
              <Card padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Assigned Expert
                </span>
                {task.assigned_employee ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={task.assigned_employee.name}
                        src={task.assigned_employee.avatar}
                        size="md"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{task.assigned_employee.name}</h4>
                        <p className="text-xs text-slate-500">{task.assigned_employee.title}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span>Expert Match Score:</span>
                        <span className="font-bold text-indigo-600">{task.match_score || 95}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Workload:</span>
                        <span className="font-medium text-slate-800">{task.assigned_employee.workload_percentage}%</span>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setActiveTab('messages')}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Direct Message
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-50 text-center text-xs text-slate-500 space-y-1">
                    <Clock className="w-5 h-5 text-indigo-500 mx-auto mb-1 animate-spin" />
                    <p className="font-semibold text-slate-800">Automated Routing Active</p>
                    <p className="text-[11px] text-slate-400">Our engine is matching candidate experts</p>
                  </div>
                )}
              </Card>

              {/* Task Meta details */}
              <Card padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-3 text-xs text-slate-600">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">
                  Task Parameters
                </span>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                    {TASK_STATUS_LABELS[task.status]}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Priority</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Start Date</span>
                  <span className="font-medium text-slate-800">{task.start_date}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Target Deadline</span>
                  <span className="font-medium text-slate-800">{task.end_date}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold text-indigo-600">{task.progress_percentage}%</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <Card padding="none" className="border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col h-[550px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Task Conversation Thread</h3>
                <p className="text-[11px] text-slate-500">Direct communication with assigned expert & admin</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No messages yet. Send a note to the assigned team below.
                </div>
              ) : (
                messages.map(m => {
                  const isClient = m.sender_role === 'CLIENT'
                  return (
                    <div key={m.id} className={`flex gap-3 ${isClient ? 'justify-end' : 'justify-start'}`}>
                      {!isClient && (
                        <Avatar name={m.sender_name} size="sm" />
                      )}
                      <div className={`max-w-md space-y-1 ${isClient ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700">{m.sender_name}</span>
                          <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isClient
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

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2 bg-slate-50">
              <input
                type="text"
                placeholder="Type your message to the expert..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1 h-10 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <Button type="submit" size="sm" className="bg-indigo-600 text-white font-medium px-4">
                <Send className="w-3.5 h-3.5 mr-1" /> Send
              </Button>
            </form>
          </Card>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <Card padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Attached Files & Deliverables
              </h3>
              <div className="divide-y divide-slate-100">
                {files.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No files uploaded for this task.</p>
                ) : (
                  files.map(file => (
                    <div key={file.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{file.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {file.size} • Uploaded by {file.uploaded_by} • Category: {file.category}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.url}
                        download
                        onClick={e => {
                          e.preventDefault()
                          success('Download Started', `Downloading ${file.name}`)
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
