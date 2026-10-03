'use client'

import React, { useState } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { HelpCircle, MessageSquare, BookOpen, Send, CheckCircle2 } from 'lucide-react'

export default function ClientHelpPage() {
  const { success } = useToast()
  const [subject, setSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !ticketMessage) return
    setSubmitted(true)
    success('Support Ticket Created', 'Our operations team has received your ticket and will respond shortly.')
  }

  const faqs = [
    {
      q: 'How does the AI Automated Expert Routing work?',
      a: 'When you submit a project brief, our algorithm analyzes required skill vectors, current employee workload capacity, and domain seniority to match and assign the best available expert.',
    },
    {
      q: 'What is the review and revision workflow?',
      a: 'Once an expert completes deliverables, the work is reviewed by operations admins. If changes are needed, a revision is requested directly. Once approved by admin, you receive final deliverables for acceptance.',
    },
    {
      q: 'Can I communicate directly with my assigned expert?',
      a: 'Yes! Every active task features an integrated real-time message thread accessible from your Task Details and Messages tabs.',
    },
    {
      q: 'What file formats are supported for upload?',
      a: 'You can upload Figma source files, Adobe Creative Cloud assets, PDFs, datasets, videos, and zip archives up to 50MB per file.',
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Help & Support Desk"
        subtitle="Frequently asked questions, workflow guides, and direct priority support"
      />

      <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
        {/* Support Ticket & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <Card key={idx} padding="md" className="border-slate-200/80 bg-white shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">{faq.q}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Support Form */}
          <Card padding="lg" className="border-slate-200/80 bg-white shadow-sm space-y-5 h-fit">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Direct Support Request</h3>
                <p className="text-xs text-slate-500">Need help with a task or billing inquiry? Contact us</p>
              </div>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Subject"
                  placeholder="e.g. Question regarding deliverable format for TSK-101"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Message Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={ticketMessage}
                    onChange={e => setTicketMessage(e.target.value)}
                    placeholder="Provide details of your question or issue..."
                    className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Support Ticket
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Ticket Submitted!</h4>
                <p className="text-xs text-slate-500">
                  Our operations team will review your inquiry and follow up within 2 hours.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false)
                    setSubject('')
                    setTicketMessage('')
                  }}
                  className="mt-3 text-xs"
                >
                  Submit Another Question
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
