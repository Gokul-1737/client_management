'use client'

import * as React from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  name?: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeConfig = {
  xs: { container: 'w-6 h-6 text-xs', text: 'text-[10px]' },
  sm: { container: 'w-7 h-7', text: 'text-xs' },
  md: { container: 'w-8 h-8', text: 'text-sm' },
  lg: { container: 'w-10 h-10', text: 'text-base' },
  xl: { container: 'w-12 h-12', text: 'text-lg' },
}

// Generate a color from name
function getAvatarColor(name: string): string {
  const colors = [
    'bg-indigo-500',
    'bg-violet-500',
    'bg-sky-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-teal-500',
    'bg-pink-500',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const config = sizeConfig[size]
  const [imgError, setImgError] = React.useState(false)

  if (src && !imgError) {
    return (
      <div className={cn('rounded-full overflow-hidden flex-shrink-0', config.container, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  const initials = name ? getInitials(name) : '?'
  const bgColor = name ? getAvatarColor(name) : 'bg-slate-400'

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold select-none',
        config.container,
        config.text,
        bgColor,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  )
}

interface AvatarGroupProps {
  users: { name: string; src?: string }[]
  max?: number
  size?: 'xs' | 'sm' | 'md'
}

export function AvatarGroup({ users, max = 3, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((user, i) => (
        <Avatar
          key={i}
          name={user.name}
          src={user.src}
          size={size}
          className="border-2 border-white ring-0"
        />
      ))}
      {remaining > 0 && (
        <div className={cn(
          'rounded-full flex items-center justify-center bg-slate-100 border-2 border-white',
          'text-xs font-medium text-slate-600',
          sizeConfig[size].container
        )}>
          +{remaining}
        </div>
      )}
    </div>
  )
}
