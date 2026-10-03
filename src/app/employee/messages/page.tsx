'use client'

import React, { useState, useEffect } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Task, Message } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DEMO_USERS } from '@/lib/auth'
import { Send } from 'lucide-react'

export default function EmployeeMessagesPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  const currentEmployeeId = DEMO_USERS.employee_karthik.id

  const loadData = () => {
    const all = TaskFlowStore.getTasks().filter(t => t.assigned_employee_id === currentEmployeeId)
    setTasks(all)
    if (!selectedTask && all.length > 0) {
      setSelectedTask(all[0])
      setMessages(TaskFlowStore.getMessages(all[0].id))
    } else if (selectedTask) {
      setMessages(TaskFlowStore.getMessages(selectedTask.id))
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedTask) return

    TaskFlowStore.addMessage({
      thread_id: selectedTask.id,
      sender_id: currentEmployeeId,
      sender_name: DEMO_USERS.employee_karthik.full_name,
      sender_role: 'EMPLOYEE',
      content: newMessage.trim(),
    })

    setNewMessage('')
    setMessages(TaskFlowStore.getMessages(selectedTask.id))
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Direct Project Communication"
        subtitle="Chat directly with clients and operation directors regarding deliverables and specifications"
      />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1 flex flex-col">
        <Card padding="none" className="flex-1 border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Threads Sidebar */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col">
            <div className="p-3 border-b border-slate-200 text-xs font-bold text-slate-700">
              Assigned Project Channels
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {tasks.map(t => {
                const isSelected = selectedTask?.id === t.id
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTask(t)
                      setMessages(TaskFlowStore.getMessages(t.id))
                    }}
                    className={`p-3 cursor-pointer text-left ${
                      isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold text-indigo-600 block">{t.task_number}</span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{t.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Client: {t.client_name}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Chat */}
          {selectedTask ? (
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-4 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-900">{selectedTask.title}</h4>
                <p className="text-[11px] text-slate-500">Client: {selectedTask.client_name}</p>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-12">No messages in this thread yet.</p>
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
                              isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
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

              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message to client..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-1 h-10 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" className="bg-indigo-600 text-white text-xs px-4">
                  <Send className="w-3.5 h-3.5 mr-1" /> Send
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              No task channel selected
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
