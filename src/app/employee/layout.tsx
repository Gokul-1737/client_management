import React from 'react'
import { EmployeeSidebar } from '@/components/layout/employee-sidebar'

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      <EmployeeSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  )
}
