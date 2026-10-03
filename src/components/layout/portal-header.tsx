'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Bell, Zap, LogOut } from 'lucide-react'
import { getCurrentUser, DEMO_USERS, logout } from '@/lib/auth'
import { TaskFlowStore } from '@/lib/store'
import { Notification, Profile } from '@/lib/types'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface PortalHeaderProps {
  title: string
  subtitle?: string
}

export function PortalHeader({ title, subtitle }: PortalHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurUser] = useState<Profile | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchModal, setShowSearchModal] = useState(false)

  const reloadData = () => {
    let u = getCurrentUser()
    if (!u) {
      if (pathname.startsWith('/client')) {
        u = DEMO_USERS.client
      } else if (pathname.startsWith('/employee')) {
        u = DEMO_USERS.employee_karthik
      } else {
        u = DEMO_USERS.admin
      }
    }
    setCurUser(u)
    const notifs = TaskFlowStore.getNotifications(u.id)
    setNotifications(notifs)
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('taskflow_store_updated', handleUpdate)
    return () => window.removeEventListener('taskflow_store_updated', handleUpdate)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    if (currentUser) {
      TaskFlowStore.markAllNotificationsRead(currentUser.id)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  const allTasks = TaskFlowStore.getTasks()
  const searchResults = searchQuery.trim()
    ? allTasks.filter(
        t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.task_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-[4.5rem] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-md sm:px-6 lg:px-8">
        {/* Left: Title & Subtitle */}
        <div>
          <h1 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-slate-950">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>

        {/* Right: Search, Role Switcher, Notifications, User Menu */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 rounded-lg transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search tasks, files, experts...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-200 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Portal identity */}
          {pathname.startsWith('/client') || currentUser?.role === 'CLIENT' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 text-xs font-semibold text-emerald-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Client Portal</span>
            </div>
          ) : pathname.startsWith('/admin') ? (
            <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <Zap className="h-3.5 w-3.5 text-indigo-600" />
              <span>Admin workspace</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-violet-200 bg-violet-50/70 text-xs font-semibold text-violet-800">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              <span>Expert Portal</span>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                  ) : (
                    notifications.slice(0, 6).map(notif => (
                      <div
                        key={notif.id}
                        className={cn(
                          'p-3.5 hover:bg-slate-50 text-left transition-colors cursor-pointer',
                          !notif.read && 'bg-indigo-50/40'
                        )}
                        onClick={() => {
                          TaskFlowStore.markNotificationRead(notif.id)
                          if (notif.task_id) {
                            const prefix = currentUser?.role?.toLowerCase() || 'admin'
                            router.push(`/${prefix}/tasks/${notif.task_id}`)
                            setShowNotifications(false)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-100 p-2 text-center bg-slate-50">
                  <Link
                    href={`/${currentUser?.role?.toLowerCase() || 'client'}/notifications`}
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View All Activity & Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Avatar
                name={currentUser?.full_name || 'Alex Rivera'}
                src={currentUser?.avatar_url}
                size="sm"
              />
              <div className="hidden sm:block text-left text-xs leading-tight">
                <p className="font-semibold text-slate-800">{currentUser?.full_name || 'Alex Rivera'}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentUser?.role?.toLowerCase()}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white p-2 shadow-xl border border-slate-200 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-900">{currentUser?.full_name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                </div>
                <Link
                  href={`/${currentUser?.role?.toLowerCase() || 'client'}/profile`}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
                >
                  Account Profile
                </Link>
                <Link
                  href={`/${currentUser?.role?.toLowerCase() || 'client'}/settings`}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
                >
                  Preferences & Settings
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal (Stitch: Screen 22) */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center px-4 py-3 border-b border-slate-200">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search tasks, task ID, keywords, deliverables..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm bg-transparent outline-none text-slate-900 placeholder-slate-400"
              />
              <button
                onClick={() => {
                  setShowSearchModal(false)
                  setSearchQuery('')
                }}
                className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === '' ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Type something to search all projects, deliverables, and assignments.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No matching tasks found.</div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map(t => (
                    <div
                      key={t.id}
                      onClick={() => {
                        const prefix = currentUser?.role?.toLowerCase() || 'client'
                        router.push(`/${prefix}/tasks/${t.id}`)
                        setShowSearchModal(false)
                      }}
                      className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {t.task_number}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">
                            {t.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t.description}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
