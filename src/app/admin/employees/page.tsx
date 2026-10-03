'use client'

import React, { useState, useEffect } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { Users, Plus, Search, ShieldCheck, Mail, Briefcase } from 'lucide-react'

export default function AdminEmployeesPage() {
  const { success } = useToast()
  const [employees, setEmployees] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const loadData = () => {
    setEmployees(TaskFlowStore.getEmployees())
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const filtered = employees.filter(
    e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Domain Experts & Employee Roster"
        subtitle="Manage expert skill profiles, capacity limits, and departmental assignments"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experts, skills, titles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <Button
            onClick={() => success('Add Expert', 'New expert invitation dialog opened')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Domain Expert
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(emp => (
            <Card key={emp.id} padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={emp.name} src={emp.avatar} size="lg" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{emp.name}</h3>
                    <p className="text-xs text-slate-500">{emp.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{emp.email}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    emp.availability_status === 'AVAILABLE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {emp.availability_status}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{emp.bio}</p>

              {/* Workload Progress */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Current Workload:</span>
                  <span className="font-bold text-slate-800">{emp.workload_percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      emp.workload_percentage > 70 ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${emp.workload_percentage}%` }}
                  />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Expertise Skills
                </span>
                <div className="flex flex-wrap gap-1">
                  {emp.skills.map((s: string) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
