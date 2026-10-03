'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { BrainCircuit, Sliders, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default function AdminAutomationPage() {
  const { success } = useToast()
  const [minMatchScore, setMinMatchScore] = useState(75)
  const [maxWorkload, setMaxWorkload] = useState(80)

  const [rules, setRules] = useState([
    {
      id: 'rule-1',
      name: 'Software Dev Auto-Route',
      department: 'Software Development',
      skills: ['React', 'TypeScript', 'Node.js'],
      active: true,
    },
    {
      id: 'rule-2',
      name: 'UI/UX Design Auto-Route',
      department: 'UI/UX Design',
      skills: ['Figma', 'UI Design', 'Design Systems'],
      active: true,
    },
    {
      id: 'rule-3',
      name: 'Video Production Fast-Track',
      department: 'Video Production',
      skills: ['Premiere Pro', 'After Effects', 'Video Editing'],
      active: true,
    },
    {
      id: 'rule-4',
      name: 'Graphic Design Routing',
      department: 'Graphic Design',
      skills: ['Photoshop', 'Illustrator'],
      active: false,
    },
  ])

  const toggleRule = (id: string) => {
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, active: !r.active } : r))
    )
    success('Rule Updated', 'Automation rule state toggled.')
  }

  const handleSaveParameters = () => {
    success('Automation Parameters Saved', 'AI scoring threshold and workload limits updated.')
  }

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="AI Automation Rules & Expert Routing Configuration"
        subtitle="Fine-tune machine learning matching parameters, workload caps, and routing triggers"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto">
        {/* Core Global Engine Parameters */}
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Matching Engine Calibration</h3>
              <p className="text-xs text-slate-500">Configure thresholds for automated expert routing decisions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Minimum Skill Match Threshold:</span>
                <span className="text-indigo-600 font-bold">{minMatchScore}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={minMatchScore}
                onChange={e => setMinMatchScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] text-slate-400">
                Tasks with match scores below {minMatchScore}% require manual admin review before assignment.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Max Employee Workload Cap:</span>
                <span className="text-indigo-600 font-bold">{maxWorkload}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={maxWorkload}
                onChange={e => setMaxWorkload(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] text-slate-400">
                Prevents routing new tasks to experts whose current workload exceeds {maxWorkload}%.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveParameters} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
              Save Engine Parameters
            </Button>
          </div>
        </Card>

        {/* Routing Rules Table */}
        <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Departmental Routing Rules</h3>
                <p className="text-xs text-slate-500">Automated classification rules mapped to skill taxonomies</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {rules.map(rule => (
              <div key={rule.id} className="py-3.5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{rule.name}</h4>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {rule.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span>Key skills: {rule.skills.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rule.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {rule.active ? 'ACTIVE' : 'DISABLED'}
                  </span>
                  <input
                    type="checkbox"
                    checked={rule.active}
                    onChange={() => toggleRule(rule.id)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
