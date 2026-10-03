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
  Users,
  UserCircle,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Zap,
  ChevronDown,
  Inbox,
  UserCheck,
  Gauge,
  Cog,
  FileText,
  Activity,
  Sparkles,
  Wrench,
} from 'lucide-react'

interface SidebarProps {
  user?: { name?: string; email?: string; avatar?: string }
  notificationCount?: number
}

const navGroups = [
  {
    items: [
      { href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    ],
  },
  {
    label: 'Tasks',
    items: [
      { href: '/admin/tasks', icon: <ClipboardList className="w-4 h-4" />, label: 'All Tasks' },
      { href: '/admin/tasks/incoming', icon: <Inbox className="w-4 h-4" />, label: 'Incoming' },
      { href: '/admin/assignments', icon: <UserCheck className="w-4 h-4" />, label: 'Assignments' },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/admin/clients', icon: <Users className="w-4 h-4" />, label: 'Clients' },
      { href: '/admin/employees', icon: <UserCircle className="w-4 h-4" />, label: 'Employees' },
      { href: '/admin/teams', icon: <Users className="w-4 h-4" />, label: 'Teams' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/workload', icon: <Gauge className="w-4 h-4" />, label: 'Workload' },
      { href: '/admin/automation', icon: <Sparkles className="w-4 h-4" />, label: 'Automation' },
      { href: '/admin/skills', icon: <Wrench className="w-4 h-4" />, label: 'Skills' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/admin/reports', icon: <BarChart3 className="w-4 h-4" />, label: 'Reports' },
      { href: '/admin/activity', icon: <Activity className="w-4 h-4" />, label: 'Activity Logs' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/admin/notifications', icon: <Bell className="w-4 h-4" />, label: 'Notifications' },
      { href: '/admin/messages', icon: <MessageSquare className="w-4 h-4" />, label: 'Messages' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
    ],
  },
]

export function AdminSidebar({ user, notificationCount = 0 }: SidebarProps) {
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
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 leading-none">TaskFlow AI</div>
          <div className="text-[10px] text-rose-500 mt-0.5 uppercase tracking-wider font-semibold">Admin Portal</div>
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
              {group.items.map((item: { href: string; icon: React.ReactNode; label: string }) => {
                const isActive = pathname === item.href || (item.href !== '/admin/tasks' && pathname.startsWith(item.href + '/')) || (item.href === '/admin/tasks' && pathname === '/admin/tasks')
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
                    {item.href === '/admin/notifications' && notificationCount > 0 && (
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
          <Avatar name={user?.name || 'Admin'} src={user?.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{user?.name || 'Admin'}</div>
            <div className="text-xs text-primary-600 truncate font-medium">Administrator</div>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-slate-400 flex-shrink-0 transition-transform', userMenuOpen && 'rotate-180')} />
        </button>

        {userMenuOpen && (
          <div className="mt-1 py-1 bg-white border border-slate-200 rounded-lg shadow-dropdown">
            <Link href="/admin/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <Cog className="w-3.5 h-3.5 text-slate-400" />
              Admin Settings
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
