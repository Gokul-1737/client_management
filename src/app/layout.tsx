import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

export const metadata: Metadata = {
  title: {
    default: 'TaskFlow AI - Client Task Management Platform',
    template: '%s | TaskFlow AI',
  },
  description: 'AI-Powered Client Task Management & Automated Expert Assignment Platform. Streamline your workflow with intelligent task routing and real-time progress tracking.',
  keywords: ['task management', 'AI automation', 'expert assignment', 'workflow', 'project management'],
  authors: [{ name: 'TaskFlow AI' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'TaskFlow AI - Intelligent Task Management',
    description: 'AI-Powered Client Task Management & Automated Expert Assignment Platform',
    siteName: 'TaskFlow AI',
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
