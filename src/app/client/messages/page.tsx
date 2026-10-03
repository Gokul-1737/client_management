'use client'

import React, { useState, useEffect } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Task, Message } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { MessageSquare, Send, Search, CheckCheck } from 'lucide-react'

export default function ClientMessagesPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')

  const loadData = () => {
    const all = TaskFlowStore.getTasks()
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

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
    setMessages(TaskFlowStore.getMessages(task.id))
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedTask) return

    TaskFlowStore.addMessage({
      thread_id: selectedTask.id,
      sender_id: 'client-user',
      sender_name: 'Sarah Jenkins',
      sender_role: 'CLIENT',
      content: newMessage.trim(),
    })

    setNewMessage('')
    setMessages(TaskFlowStore.getMessages(selectedTask.id))
  }

  const filteredTasks = tasks.filter(
    t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.task_number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Communication & Messages"
        subtitle="Collaborate directly with assigned domain experts and operations managers"
      />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1 flex flex-col">
        <Card padding="none" className="flex-1 border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Threads List Sidebar */}
          <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter project threads..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredTasks.map(task => {
                const isSelected = selectedTask?.id === task.id
                return (
                  <div
                    key={task.id}
                    onClick={() => handleSelectTask(task)}
                    className={`p-3.5 cursor-pointer text-left transition-colors ${
                      isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-indigo-600">{task.task_number}</span>
                      <span className="text-slate-400">{task.status}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {task.assigned_employee ? `Assigned: ${task.assigned_employee.name}` : 'Awaiting routing'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Conversation Pane */}
          {selectedTask ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {selectedTask.task_number}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{selectedTask.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedTask.assigned_employee
                      ? `Active discussion with ${selectedTask.assigned_employee.name} (${selectedTask.assigned_employee.title})`
                      : 'Team discussion channel'}
                  </p>
                </div>
              </div>

              {/* Messages Content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <MessageSquare className="w-8 h-8 mb-2 text-slate-300" />
                    <p className="text-xs">No messages yet in this project channel.</p>
                    <p className="text-[11px]">Type below to start the conversation.</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender_role === 'CLIENT'
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && <Avatar name={msg.sender_name} size="sm" />}
                        <div className={`max-w-md space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="font-bold text-slate-700">{msg.sender_name}</span>
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${selectedTask.assigned_employee?.name || 'team'}...`}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-1 h-10 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5">
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Send
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a project to view messages
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
