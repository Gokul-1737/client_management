'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { TaskPriority } from '@/lib/types'
import { TASK_TYPE_OPTIONS, SKILL_OPTIONS, PRIORITY_OPTIONS } from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { getCurrentUser, getDemoUserForRole } from '@/lib/auth'
import {
  Sparkles,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  BrainCircuit,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'

export default function CreateTaskPage() {
  const router = useRouter()
  const { success, error: toastError } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [departmentId, setDepartmentId] = useState('dept-dev')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0])
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript'])
  const [files, setFiles] = useState<Array<{ name: string; size: string }>>([])
  const [submitting, setSubmitting] = useState(false)
  const [submittedTask, setSubmittedTask] = useState<any | null>(null)
  const [clientIdentity, setClientIdentity] = useState(() => {
    const user = getCurrentUser() || getDemoUserForRole('CLIENT')
    const storedCompany = typeof window !== 'undefined'
      ? window.localStorage.getItem('taskflow_company_profile')
      : null

    try {
      const company = storedCompany ? JSON.parse(storedCompany) as { name?: string } : null
      return {
        id: user.id,
        name: company?.name || user.company_name || user.full_name || 'Client organization',
        email: user.email || '',
      }
    } catch {
      return {
        id: user.id,
        name: user.company_name || user.full_name || 'Client organization',
        email: user.email || '',
      }
    }
  })

  useEffect(() => {
    const refreshClientIdentity = () => {
      const user = getCurrentUser() || getDemoUserForRole('CLIENT')
      let companyName = user.company_name
      try {
        const stored = window.localStorage.getItem('taskflow_company_profile')
        companyName = stored ? (JSON.parse(stored) as { name?: string }).name || companyName : companyName
      } catch {
        // Keep the authenticated profile name when no local company profile is available.
      }
      setClientIdentity({
        id: user.id,
        name: companyName || user.full_name || 'Client organization',
        email: user.email || '',
      })
    }

    window.addEventListener('taskflow_profile_updated', refreshClientIdentity)
    return () => window.removeEventListener('taskflow_profile_updated', refreshClientIdentity)
  }, [])

  // AI Matching preview state
  const [aiAnalysis, setAiAnalysis] = useState<{
    suggestedSkills: string[]
    estimatedHours: number
    complexity: string
    recommendedExpert: any | null
    matchScore: number
  }>({
    suggestedSkills: ['React', 'TypeScript'],
    estimatedHours: 40,
    complexity: 'Moderate',
    recommendedExpert: null,
    matchScore: 94,
  })

  // Recalculate AI analysis dynamically
  useEffect(() => {
    const analysis = TaskFlowStore.calculateBestExpertMatch({
      title,
      description,
      department_id: departmentId,
      required_skills: selectedSkills,
      priority,
    })

    if (analysis) {
      setAiAnalysis({
        suggestedSkills: selectedSkills,
        estimatedHours: priority === 'URGENT' ? 24 : 48,
        complexity: priority === 'URGENT' ? 'High' : 'Moderate',
        recommendedExpert: analysis.employee,
        matchScore: analysis.score,
      })
    }
  }, [title, description, departmentId, selectedSkills, priority])

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0]
      setFiles(prev => [...prev, { name: f.name, size: `${(f.size / (1024 * 1024)).toFixed(1)} MB` }])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toastError('Title is required', 'Please provide a clear title for your project request.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      const newTask = TaskFlowStore.createTask({
        title,
        description,
        department_id: departmentId,
        priority,
        start_date: startDate,
        end_date: endDate,
        required_skills: selectedSkills,
        client_name: clientIdentity.name,
        client_email: clientIdentity.email,
        created_by: clientIdentity.id,
      })

      // Add attached files
      files.forEach(f => {
        TaskFlowStore.addFile({
          task_id: newTask.id,
          name: f.name,
          size: f.size,
          type: 'document',
          category: 'CLIENT_ATTACHMENT',
          uploaded_by: clientIdentity.name,
        })
      })

      setSubmitting(false)
      setSubmittedTask(newTask)
      success('Task Submitted Successfully!', 'Our automated AI engine is routing this to top experts.')
    }, 600)
  }

  if (submittedTask) {
    return (
      <div className="flex-1 flex flex-col">
        <PortalHeader title="Task Created" />
        <main className="p-8 max-w-2xl mx-auto w-full my-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {submittedTask.task_number}
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Task Successfully Submitted!</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Your task <span className="font-semibold text-slate-800">&quot;{submittedTask.title}&quot;</span> has entered our automated analysis and expert routing queue.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
              <span className="text-slate-500">Department</span>
              <span className="font-semibold text-slate-800">
                {departmentId === 'dept-dev' ? 'Software Development' : departmentId === 'dept-uiux' ? 'UI/UX Design' : 'Creative Studio'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
              <span className="text-slate-500">AI Match Score</span>
              <span className="font-bold text-indigo-600">{aiAnalysis.matchScore}% Match</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Initial Status</span>
              <span className="font-medium text-emerald-600">SUBMITTED (In Routing)</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              onClick={() => router.push(`/client/tasks/${submittedTask.id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              View Task Details & Timeline <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSubmittedTask(null)
                setTitle('')
                setDescription('')
                setFiles([])
              }}
            >
              Submit Another Brief
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Create New Task Request"
        subtitle="Submit a project brief with AI-assisted requirements analysis and expert matching"
      />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Task Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg" className="border-slate-200/80 shadow-sm bg-white space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Task Overview & Scope</h2>
                <p className="text-xs text-slate-500">
                  Provide detailed specifications to ensure accurate automated expert matching.
                </p>
              </div>

              <Input
                label="Task Title"
                placeholder="e.g. Redesign Mobile Checkout Flow & Payment Webhooks"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Detailed Description & Acceptance Criteria <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your deliverables, technical prerequisites, design references, and expectations..."
                  className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Target Department</label>
                  <select
                    value={departmentId}
                    onChange={e => setDepartmentId(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="dept-dev">Software Development</option>
                    <option value="dept-uiux">UI/UX Design</option>
                    <option value="dept-video">Video Production</option>
                    <option value="dept-graphics">Graphic Design</option>
                    <option value="dept-marketing">Digital Marketing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Priority Level</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as TaskPriority)}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {PRIORITY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} Priority
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Target Start Date"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
                <Input
                  label="Required Deadline"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </div>

              {/* Required Skills Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700">
                  Required Skillsets (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map(skill => {
                    const isSelected = selectedSkills.includes(skill.value)
                    return (
                      <button
                        type="button"
                        key={skill.value}
                        onClick={() => toggleSkill(skill.value)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {skill.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* File Attachment Dropzone */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700">
                  Supporting Documents & Assets
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition-all">
                  <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to upload or drag files here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Figma links, PDF briefs, Wireframes, Datasets (up to 50MB)
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {files.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium text-slate-800">{file.name}</span>
                          <span className="text-slate-400">({file.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Link href="/client/tasks">
                  <Button variant="ghost" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  loading={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6"
                >
                  Submit Project Request
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: AI Auto-Routing & Expert Matching Preview */}
          <div className="space-y-5">
            <Card padding="md" className="border-indigo-100 bg-gradient-to-b from-indigo-50/60 to-white shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI Auto-Routing Engine
                  </h3>
                  <p className="text-[11px] text-slate-500">Live capability & workload matching</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Estimated Match Score</span>
                  <span className="text-sm font-bold text-indigo-700">{aiAnalysis.matchScore}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${aiAnalysis.matchScore}%` }}
                  />
                </div>
              </div>

              {aiAnalysis.recommendedExpert && (
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Recommended Top Expert
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <UserCheck className="w-3 h-3" /> Available
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={aiAnalysis.recommendedExpert.avatar}
                      alt={aiAnalysis.recommendedExpert.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {aiAnalysis.recommendedExpert.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {aiAnalysis.recommendedExpert.title}
                      </p>
                      <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                        {aiAnalysis.recommendedExpert.experience_years} yrs exp • {aiAnalysis.recommendedExpert.workload_percentage}% workload
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estimated Effort:</span>
                  <span className="font-semibold text-slate-800">{aiAnalysis.estimatedHours} hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Complexity:</span>
                  <span className="font-semibold text-slate-800">{aiAnalysis.complexity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Auto-Approval Check:</span>
                  <span className="font-semibold text-emerald-600">Enabled</span>
                </div>
              </div>
            </Card>

            {/* Workflow Guarantee Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Strict Delivery Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Every task is routed through verified experts, tracked in real-time, and subject to admin review before final deliverable release.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
