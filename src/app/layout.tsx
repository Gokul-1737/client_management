import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

export const metadata: Metadata = {
  title: {
    default: 'Probyzaar Technologies - Client Task Management Platform',
    template: '%s | Probyzaar Technologies',
  },
  description: 'Probyzaar Technologies client task management workspace for intelligent routing and real-time delivery tracking.',
  keywords: ['task management', 'AI automation', 'expert assignment', 'workflow', 'project management'],
  authors: [{ name: 'Probyzaar Technologies' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Probyzaar Technologies - Intelligent Task Management',
    description: 'A focused workspace for client delivery, expert collaboration, and task operations.',
    siteName: 'Probyzaar Technologies',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#f4f7fb] text-slate-900 antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
