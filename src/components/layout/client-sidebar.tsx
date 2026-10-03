'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  MessageSquare,
  FileText,
  Bell,
  Building2,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
  ChevronDown,
} from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
  badge?: number
}

interface NavGroup {
  label?: string
  items: NavItem[]
}

interface SidebarProps {
  user?: { name?: string; email?: string; avatar?: string }
  notificationCount?: number
}

const navGroups: NavGroup[] = [
  {
    items: [
      { href: '/client/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    ],
  },
  {
    label: 'Tasks',
    items: [
      { href: '/client/tasks', icon: <ClipboardList className="w-4 h-4" />, label: 'My Tasks' },
      { href: '/client/tasks/new', icon: <Plus className="w-4 h-4" />, label: 'Create Task' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/client/messages', icon: <MessageSquare className="w-4 h-4" />, label: 'Messages' },
      { href: '/client/files', icon: <FileText className="w-4 h-4" />, label: 'Files' },
      { href: '/client/notifications', icon: <Bell className="w-4 h-4" />, label: 'Notifications' },
    ],
  },
  {
    label: 'Company',
    items: [
      { href: '/client/company', icon: <Building2 className="w-4 h-4" />, label: 'Company Profile' },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/client/profile', icon: <User className="w-4 h-4" />, label: 'My Profile' },
      { href: '/client/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
    ],
  },
  {
    label: 'Help',
    items: [
      { href: '/client/help', icon: <HelpCircle className="w-4 h-4" />, label: 'Help & Support' },
    ],
  },
]

export function ClientSidebar({ user, notificationCount = 0 }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { success } = useToast()
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    success('Signed out successfully')
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="sticky top-0 z-40 flex h-screen min-h-screen w-[15.5rem] flex-shrink-0 flex-col border-r border-slate-200/80 bg-[#fbfcfe]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-[1.125rem]">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.625rem] bg-primary-600">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 leading-none">TaskFlow AI</div>
          <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">Client Portal</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex min-h-9 items-center gap-3 rounded-[0.5rem] px-3 py-2 text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <span className={cn(isActive ? 'text-primary-600' : 'text-slate-400')}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.href === '/client/notifications' && notificationCount > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Menu */}
      <div className="border-t border-slate-100 p-3">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
        >
          <Avatar name={user?.name || 'Client'} src={user?.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{user?.name || 'Client User'}</div>
            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-slate-400 flex-shrink-0 transition-transform', userMenuOpen && 'rotate-180')} />
        </button>

        {userMenuOpen && (
          <div className="mt-1 py-1 bg-white border border-slate-200 rounded-lg shadow-dropdown">
            <Link href="/client/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Profile Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
