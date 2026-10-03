import React from 'react'
import { ClientSidebar } from '@/components/layout/client-sidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      <ClientSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  )
}
