'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'xs' | 'sm' | 'md'
  color?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  className?: string
  animated?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  size = 'sm',
  color = 'primary',
  showLabel = false,
  className,
  animated = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
  }

  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
  }

  const getAutoColor = () => {
    if (percentage >= 75) return colors.success
    if (percentage >= 50) return colors.primary
    if (percentage >= 25) return colors.warning
    return colors.error
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-medium text-slate-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('bg-slate-100 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            animated && 'animate-pulse-subtle',
            color === 'primary' ? getAutoColor() : colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface WorkloadIndicatorProps {
  percentage: number
  className?: string
}

export function WorkloadIndicator({ percentage, className }: WorkloadIndicatorProps) {
  const getColor = () => {
    if (percentage >= 80) return { bar: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', label: 'High' }
    if (percentage >= 60) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', label: 'Medium' }
    return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Low' }
  }

  const { bar, text, bg, label } = getColor()

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Workload</span>
        <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded', bg, text)}>
          {label} · {percentage}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', bar)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
