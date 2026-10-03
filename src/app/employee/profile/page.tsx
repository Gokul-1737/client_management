'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { DEMO_USERS } from '@/lib/auth'
import { User, Mail, Briefcase, Camera, Shield, Plus, X } from 'lucide-react'

export default function EmployeeProfilePage() {
  const { success } = useToast()
  const [fullName, setFullName] = useState(DEMO_USERS.employee_karthik.full_name)
  const [title, setTitle] = useState('Senior Full Stack Engineer')
  const [bio, setBio] = useState('Specialized in Next.js, TypeScript, PostgreSQL, and scalable microservices architecture.')
  const [skills, setSkills] = useState(['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js', 'Python'])
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return
    setSkills(prev => [...prev, newSkill.trim()])
    setNewSkill('')
    success('Skill Added', 'Your profile matching vector has been expanded.')
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    success('Profile Updated', 'Your expert bio and skill competencies have been updated.')
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Domain Expert Profile & Skill Taxonomies"
        subtitle="Maintain your verified technical capabilities for AI matching algorithm scoring"
      />

      <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative">
              <Avatar
                name={fullName}
                src={DEMO_USERS.employee_karthik.avatar_url}
                size="xl"
                className="w-24 h-24 text-2xl"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500">{title} • Development Department</p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
                <Shield className="w-3 h-3" /> Verified Senior Expert
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
              <Input
                label="Professional Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Expert Bio & Specialization</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700">Verified Skills for AI Matching</label>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2 max-w-sm">
                <input
                  type="text"
                  placeholder="Add skill (e.g. GraphQL)..."
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  className="flex-1 h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <Button type="button" size="sm" onClick={handleAddSkill} className="bg-indigo-600 text-white text-xs h-8 px-3">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                Save Expert Profile
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
