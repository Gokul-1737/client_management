// Probyzaar Technologies - Unified Authentication & Session Management

import { UserRole, Profile } from './types'

export const DEMO_USERS: Record<string, Profile> = {
  admin: {
    id: 'u0000000-0000-0000-0000-000000000001',
    email: 'admin@taskflow.ai',
    full_name: 'Alex Rivera',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+1 (555) 019-2834',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  client: {
    id: 'u0000000-0000-0000-0000-000000000002',
    email: 'client@abc.com',
    full_name: 'Sarah Jenkins',
    role: 'CLIENT',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    phone: '+1 (555) 018-7742',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  employee_karthik: {
    id: 'u0000000-0000-0000-0000-000000000003',
    email: 'karthik@taskflow.ai',
    full_name: 'Karthik Raja',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+1 (555) 014-9921',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  employee_elena: {
    id: 'u0000000-0000-0000-0000-000000000004',
    email: 'elena@taskflow.ai',
    full_name: 'Elena Rostova',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '+1 (555) 012-4481',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  employee_marcus: {
    id: 'u0000000-0000-0000-0000-000000000005',
    email: 'marcus@taskflow.ai',
    full_name: 'Marcus Vance',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '+1 (555) 017-8833',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
}

export function getCurrentUser(): Profile | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('taskflow_user')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

export function setCurrentUser(user: Profile | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem('taskflow_user', JSON.stringify(user))
    // Set cookie for middleware access
    document.cookie = `taskflow_role=${user.role}; path=/; max-age=604800; SameSite=Lax`
    document.cookie = `taskflow_user_id=${user.id}; path=/; max-age=604800; SameSite=Lax`
    document.cookie = `taskflow_user_email=${user.email}; path=/; max-age=604800; SameSite=Lax`
  } else {
    localStorage.removeItem('taskflow_user')
    document.cookie = 'taskflow_role=; path=/; max-age=0'
    document.cookie = 'taskflow_user_id=; path=/; max-age=0'
    document.cookie = 'taskflow_user_email=; path=/; max-age=0'
  }
}

export function getDemoUserForRole(role: UserRole): Profile {
  const user = role === 'ADMIN'
    ? DEMO_USERS.admin
    : role === 'EMPLOYEE'
      ? DEMO_USERS.employee_karthik
      : DEMO_USERS.client
  if (typeof window === 'undefined') return user
  const stored = localStorage.getItem('taskflow_user')
  if (!stored) return user
  try {
    const parsed = JSON.parse(stored) as Profile
    return parsed.id === user.id ? { ...user, ...parsed } : user
  } catch {
    return user
  }
}

export function notifyProfileUpdated(user: Profile) {
  setCurrentUser(user)
  window.dispatchEvent(new CustomEvent('taskflow_profile_updated', { detail: user }))
}

export async function updateProfile(profile: Profile, changes: Partial<Profile>): Promise<Profile> {
  const nextProfile = {
    ...profile,
    ...changes,
    updated_at: new Date().toISOString(),
  }

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  if (configured && !profile.id.startsWith('u0000000-')) {
    const { createClient } = await import('./supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: nextProfile.full_name,
        email: nextProfile.email,
        phone: nextProfile.phone,
        avatar_url: nextProfile.avatar_url,
        updated_at: nextProfile.updated_at,
      })
      .eq('id', profile.id)
      .select('*')
      .single()

    if (error) throw error
    notifyProfileUpdated({ ...nextProfile, ...data })
    return { ...nextProfile, ...data }
  }

  notifyProfileUpdated(nextProfile)
  return nextProfile
}

export async function logout() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  )

  if (configured) {
    const { createClient } = await import('./supabase/client')
    const { error } = await createClient().auth.signOut()
    if (error) {
      console.error('Unable to end the Supabase session cleanly.', error)
    }
  }

  setCurrentUser(null)
  if (typeof window !== 'undefined') {
    window.location.replace('/login')
  }
}
