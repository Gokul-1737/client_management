'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Department } from '@/lib/types'
import { Users, Layers, Plus, CheckCircle, ArrowRight } from 'lucide-react'

export default function AdminTeamsPage() {
  const departments = TaskFlowStore.getDepartments()
  const employees = TaskFlowStore.getEmployees()
  const tasks = TaskFlowStore.getTasks()

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Departmental Teams & Work Groups"
        subtitle="Manage functional departments, skill specializations, and departmental task pipelines"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {departments.length} Functional Departments Active across Global Client Workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => {
            const deptEmps = employees.filter(e => e.department_id === dept.id)
            const deptTasks = tasks.filter(t => t.department_id === dept.id)

            return (
              <Card key={dept.id} padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: dept.color }}
                    >
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                      <p className="text-xs text-slate-500">{deptEmps.length} Domain Experts</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Active Tasks</span>
                    <span className="text-sm font-bold text-slate-900">{deptTasks.length}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Capacity</span>
                    <span className="text-sm font-bold text-emerald-600">Optimal</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
