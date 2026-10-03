'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500/30 border border-indigo-700 shadow-sm',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300/50 border border-slate-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300/50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500/30 border border-rose-700',
    outline: 'bg-transparent text-indigo-600 hover:bg-indigo-50 border border-indigo-300 focus:ring-indigo-500/30',
  }

  const sizes = {
    sm: 'h-7 px-3 text-xs gap-1.5 rounded-md',
    md: 'h-9 px-4 text-sm gap-2 rounded-md',
    lg: 'h-10 px-5 text-sm gap-2 rounded-lg',
    icon: 'h-9 w-9 rounded-md',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'active:translate-y-px',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !loading && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  )
}

// Icon button variant
export function IconButton({
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}: ButtonProps) {
  return <Button className={cn('p-0', className)} variant={variant} size={size} {...props} />
}
