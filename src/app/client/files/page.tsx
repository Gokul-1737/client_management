'use client'

import React, { useState, useEffect } from 'react'
import { PortalHeader } from '@/components/layout/portal-header'
import { TaskFlowStore } from '@/lib/store'
import { TaskFile } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import {
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  FileCheck2,
  FolderOpen,
  X,
  HardDrive,
} from 'lucide-react'

export default function ClientFilesPage() {
  const { success } = useToast()
  const [files, setFiles] = useState<TaskFile[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [previewFile, setPreviewFile] = useState<TaskFile | null>(null)

  const loadData = () => {
    setFiles(TaskFlowStore.getFiles())
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const filteredFiles = files.filter(f => {
    const matchSearch = (f.name || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory
    return matchSearch && matchCat
  })

  const deliverables = files.filter(f => f.category === 'FINAL_DELIVERABLE')

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Files & Deliverables Asset Vault"
        subtitle="Access all project specifications, design source files, and finalized deliverables"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Documents</span>
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{files.length}</p>
          </Card>

          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Final Deliverables</span>
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{deliverables.length}</p>
          </Card>

          <Card padding="md" className="border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage Utilized</span>
              <HardDrive className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">460.9 MB</p>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {['ALL', 'FINAL_DELIVERABLE', 'WORK_FILE', 'CLIENT_ATTACHMENT'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL'
                  ? 'All Files'
                  : cat === 'FINAL_DELIVERABLE'
                  ? 'Deliverables'
                  : cat === 'WORK_FILE'
                  ? 'Work in Progress'
                  : 'Client Briefs'}
              </button>
            ))}
          </div>
        </div>

        {/* Files Grid / List */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFiles.map(file => (
                <tr key={file.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900">{file.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        file.category === 'FINAL_DELIVERABLE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : file.category === 'WORK_FILE'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {file.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">{file.size}</td>
                  <td className="py-3.5 px-4 text-slate-600">{file.uploaded_by}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewFile(file)}
                      className="text-xs text-slate-600 hover:text-indigo-600"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => success('Download Started', `Downloading ${file.name}`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* File Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">{previewFile.name}</h3>
                </div>
                <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-3">
                <FileText className="w-12 h-12 text-indigo-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">{previewFile.name}</p>
                <p className="text-[11px] text-slate-500">
                  Size: {previewFile.size} • Uploaded by {previewFile.uploaded_by}
                </p>
                <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-700">
                  Verified Clean & Ready
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setPreviewFile(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    success('Download Started', `Downloading ${previewFile.name}`)
                    setPreviewFile(null)
                  }}
                  className="bg-indigo-600 text-white font-medium text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download File
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
