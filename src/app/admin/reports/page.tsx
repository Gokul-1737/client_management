'use client'

import React from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { TrendingUp, Clock, CheckCircle2, Award, ArrowUpRight } from 'lucide-react'

export default function AdminReportsPage() {
  const tasks = TaskFlowStore.getTasks()
  const completed = tasks.filter(t => t.status === 'COMPLETED')

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Operational Analytics & Performance Reports"
        subtitle="Insights on automated routing efficiency, deliverable turnaround time, and client satisfaction"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Turnaround Time</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">3.4 Days</span>
              <span className="text-xs text-emerald-600 font-semibold inline-flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 24% faster
              </span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Matching Accuracy</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-600">96.8%</span>
              <span className="text-xs text-slate-500">First-time acceptance</span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revision Rate</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">6.2%</span>
              <span className="text-xs text-slate-500">Quality benchmark &lt; 10%</span>
            </div>
          </Card>

          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivered Value</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{completed.length + 15} Projects</span>
              <span className="text-xs text-indigo-600 font-semibold">100% On-Time</span>
            </div>
          </Card>
        </div>

        {/* Breakdown Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Task Volume by Department</h3>
            <div className="space-y-3 text-xs">
              {[
                { dept: 'Software Development', count: 12, pct: 40 },
                { dept: 'UI/UX Design', count: 8, pct: 28 },
                { dept: 'Video Production', count: 6, pct: 20 },
                { dept: 'Graphic Design', count: 4, pct: 12 },
              ].map(item => (
                <div key={item.dept} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">{item.dept}</span>
                    <span className="text-slate-500">{item.count} tasks ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Delivery Velocity Milestones</h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Time from Submission to Routing', val: '18 minutes avg' },
                { label: 'Time from Assignment to Acceptance', val: '45 minutes avg' },
                { label: 'Admin Quality Review Duration', val: '2.1 hours avg' },
                { label: 'Client Final Acceptance Rate', val: '99.4%' },
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-slate-700 font-medium">{m.label}</span>
                  <span className="font-bold text-indigo-700">{m.val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
