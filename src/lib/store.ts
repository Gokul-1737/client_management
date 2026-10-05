// Probyzaar Technologies - Central Data Store & Automation Engine
'use client'

import {
  Task,
  TaskStatus,
  TaskPriority,
  Profile,
  Department,
  Skill,
  EmployeeProfile,
  TaskFile,
  TaskComment,
  Notification,
  ActivityLog,
  Message,
} from './types'
import { DEMO_USERS } from './auth'

// Default Initial Seed Data
const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'dept-dev', name: 'Software Development', description: 'Web, mobile, and backend engineering', color: '#4F46E5', created_at: '2026-01-01' },
  { id: 'dept-uiux', name: 'UI/UX Design', description: 'User experience and interface design', color: '#0891B2', created_at: '2026-01-01' },
  { id: 'dept-video', name: 'Video Production', description: 'Motion graphics, editing, and animation', color: '#7C3AED', created_at: '2026-01-01' },
  { id: 'dept-graphics', name: 'Graphic Design', description: 'Branding, marketing collateral, illustrations', color: '#DB2777', created_at: '2026-01-01' },
  { id: 'dept-marketing', name: 'Digital Marketing', description: 'SEO, performance marketing, content', color: '#D97706', created_at: '2026-01-01' },
]

const DEFAULT_EMPLOYEES: (EmployeeProfile & { skills: string[]; name: string; avatar: string; email: string })[] = [
  {
    id: 'emp-karthik',
    profile_id: DEMO_USERS.employee_karthik.id,
    name: 'Karthik Raja',
    email: 'karthik@taskflow.ai',
    avatar: DEMO_USERS.employee_karthik.avatar_url!,
    department_id: 'dept-dev',
    title: 'Senior Full Stack Engineer',
    bio: 'Specialized in Next.js, TypeScript, PostgreSQL, and scalable microservices architecture.',
    availability_status: 'AVAILABLE',
    workload_percentage: 45,
    max_workload_percentage: 100,
    active_task_count: 2,
    experience_years: 7,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js', 'Python'],
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: 'emp-elena',
    profile_id: DEMO_USERS.employee_elena.id,
    name: 'Elena Rostova',
    email: 'elena@taskflow.ai',
    avatar: DEMO_USERS.employee_elena.avatar_url!,
    department_id: 'dept-uiux',
    title: 'Principal Product Designer',
    bio: 'Passionate about crafting intuitive design systems, responsive interfaces, and interactive prototypes.',
    availability_status: 'AVAILABLE',
    workload_percentage: 35,
    max_workload_percentage: 100,
    active_task_count: 1,
    experience_years: 6,
    skills: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Photoshop'],
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: 'emp-marcus',
    profile_id: DEMO_USERS.employee_marcus.id,
    name: 'Marcus Vance',
    email: 'marcus@taskflow.ai',
    avatar: DEMO_USERS.employee_marcus.avatar_url!,
    department_id: 'dept-video',
    title: 'Lead Motion & Video Director',
    bio: 'Master of visual storytelling, 4K color grading, dynamic sound design, and 3D motion graphics.',
    availability_status: 'BUSY',
    workload_percentage: 75,
    max_workload_percentage: 100,
    active_task_count: 3,
    experience_years: 8,
    skills: ['Premiere Pro', 'After Effects', 'Video Editing', 'Motion Graphics', 'Color Grading'],
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
]

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-101',
    task_number: 'TSK-101',
    title: 'Mobile Banking App UI Redesign',
    description: 'Complete overhaul of the mobile customer dashboard, card management widgets, and transaction history screens in Figma. Requires high-fidelity design system tokens and prototype interactions.',
    company_id: 'comp-acme',
    created_by: DEMO_USERS.client.id,
    task_type_id: 'tt-uiux',
    department_id: 'dept-uiux',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    progress_percentage: 65,
    assigned_employee_id: DEMO_USERS.employee_elena.id,
    assigned_employee: {
      id: DEMO_USERS.employee_elena.id,
      name: 'Elena Rostova',
      email: 'elena@taskflow.ai',
      avatar: DEMO_USERS.employee_elena.avatar_url,
      title: 'Principal Product Designer',
      workload_percentage: 35,
    },
    client_name: 'Acme Corporation (Sarah Jenkins)',
    client_email: 'client@abc.com',
    required_skills: ['Figma', 'UI Design', 'UX Research'],
    start_date: '2026-09-20',
    end_date: '2026-10-05',
    created_at: '2026-09-20T09:00:00Z',
    updated_at: '2026-09-26T14:30:00Z',
    match_score: 96,
  },
  {
    id: 'task-102',
    task_number: 'TSK-102',
    title: 'E-Commerce Microservices API Integration',
    description: 'Implement high-throughput inventory sync endpoints, payment webhooks verification, and background worker queue using Next.js Server Actions and PostgreSQL.',
    company_id: 'comp-acme',
    created_by: DEMO_USERS.client.id,
    task_type_id: 'tt-dev',
    department_id: 'dept-dev',
    priority: 'URGENT',
    status: 'SUBMITTED_FOR_REVIEW',
    progress_percentage: 100,
    assigned_employee_id: DEMO_USERS.employee_karthik.id,
    assigned_employee: {
      id: DEMO_USERS.employee_karthik.id,
      name: 'Karthik Raja',
      email: 'karthik@taskflow.ai',
      avatar: DEMO_USERS.employee_karthik.avatar_url,
      title: 'Senior Full Stack Engineer',
      workload_percentage: 45,
    },
    client_name: 'Acme Corporation (Sarah Jenkins)',
    client_email: 'client@abc.com',
    required_skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    start_date: '2026-09-18',
    end_date: '2026-09-28',
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-27T08:15:00Z',
    match_score: 94,
    submission_notes: 'All integration test suites passing. API documentation generated with Postman collection and deliverable schemas.',
  },
  {
    id: 'task-103',
    task_number: 'TSK-103',
    title: 'Product Launch 4K Teaser Video',
    description: 'Dynamic 60-second 4K promo video showcasing our new SaaS feature release. Needs upbeat sync sound effects, color graded cinematic B-roll, and kinetic typography.',
    company_id: 'comp-apex',
    created_by: DEMO_USERS.client.id,
    task_type_id: 'tt-video',
    department_id: 'dept-video',
    priority: 'MEDIUM',
    status: 'REVISION_REQUIRED',
    progress_percentage: 80,
    assigned_employee_id: DEMO_USERS.employee_marcus.id,
    assigned_employee: {
      id: DEMO_USERS.employee_marcus.id,
      name: 'Marcus Vance',
      email: 'marcus@taskflow.ai',
      avatar: DEMO_USERS.employee_marcus.avatar_url,
      title: 'Lead Motion & Video Director',
      workload_percentage: 75,
    },
    client_name: 'Apex Media Group',
    client_email: 'david@apexmedia.com',
    required_skills: ['Premiere Pro', 'After Effects', 'Video Editing'],
    start_date: '2026-09-22',
    end_date: '2026-10-02',
    created_at: '2026-09-22T11:20:00Z',
    updated_at: '2026-09-27T09:40:00Z',
    match_score: 92,
    revision_reason: 'Please adjust the outro logo animation timing from 3s to 1.5s and replace the background soundtrack with the approved brand track.',
  },
  {
    id: 'task-104',
    task_number: 'TSK-104',
    title: 'Annual Sustainability Impact Report Infographic',
    description: 'Design 8 multi-page visual infographics highlighting carbon offset milestones and green energy metrics for stakeholder distribution.',
    company_id: 'comp-acme',
    created_by: DEMO_USERS.client.id,
    task_type_id: 'tt-graphics',
    department_id: 'dept-graphics',
    priority: 'MEDIUM',
    status: 'SUBMITTED',
    progress_percentage: 0,
    client_name: 'Acme Corporation (Sarah Jenkins)',
    client_email: 'client@abc.com',
    required_skills: ['Photoshop', 'Illustrator', 'Graphic Design'],
    start_date: '2026-09-28',
    end_date: '2026-10-12',
    created_at: '2026-09-27T07:30:00Z',
    updated_at: '2026-09-27T07:30:00Z',
  },
  {
    id: 'task-105',
    task_number: 'TSK-105',
    title: 'Customer Onboarding Video Walkthrough',
    description: 'Series of 3 interactive onboarding micro-tutorials explaining billing setup, team invites, and workspace customization.',
    company_id: 'comp-acme',
    created_by: DEMO_USERS.client.id,
    task_type_id: 'tt-video',
    department_id: 'dept-video',
    priority: 'LOW',
    status: 'FINAL_DELIVERY',
    progress_percentage: 100,
    assigned_employee_id: DEMO_USERS.employee_marcus.id,
    assigned_employee: {
      id: DEMO_USERS.employee_marcus.id,
      name: 'Marcus Vance',
      email: 'marcus@taskflow.ai',
      avatar: DEMO_USERS.employee_marcus.avatar_url,
      title: 'Lead Motion & Video Director',
      workload_percentage: 75,
    },
    client_name: 'Acme Corporation (Sarah Jenkins)',
    client_email: 'client@abc.com',
    required_skills: ['Premiere Pro', 'Video Editing'],
    start_date: '2026-09-10',
    end_date: '2026-09-25',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-26T17:00:00Z',
    match_score: 95,
  },
  {
    id: 'task-106',
    task_number: 'TSK-106',
    title: 'Enterprise Single Sign-On (SSO) OAuth2 Setup',
    description: 'Configure SAML 2.0 and Google Workspace identity federation with automated profile sync.',
    company_id: 'comp-acme',
    created_by: DEMO_USERS.client.id,
    task_type_id: 'tt-dev',
    department_id: 'dept-dev',
    priority: 'HIGH',
    status: 'AWAITING_ACCEPTANCE',
    progress_percentage: 0,
    assigned_employee_id: DEMO_USERS.employee_karthik.id,
    assigned_employee: {
      id: DEMO_USERS.employee_karthik.id,
      name: 'Karthik Raja',
      email: 'karthik@taskflow.ai',
      avatar: DEMO_USERS.employee_karthik.avatar_url,
      title: 'Senior Full Stack Engineer',
      workload_percentage: 45,
    },
    client_name: 'Acme Corporation (Sarah Jenkins)',
    client_email: 'client@abc.com',
    required_skills: ['Node.js', 'TypeScript', 'PostgreSQL'],
    start_date: '2026-09-27',
    end_date: '2026-10-10',
    created_at: '2026-09-27T05:00:00Z',
    updated_at: '2026-09-27T08:00:00Z',
    match_score: 97,
  },
]

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    recipient_id: DEMO_USERS.admin.id,
    type: 'TASK_SUBMITTED_FOR_REVIEW',
    title: 'Task Ready for Review',
    message: 'Karthik Raja submitted "E-Commerce Microservices API Integration" for admin review.',
    task_id: 'task-102',
    read: false,
    created_at: '2026-09-27T08:15:00Z',
  },
  {
    id: 'notif-2',
    recipient_id: DEMO_USERS.admin.id,
    type: 'TASK_CREATED',
    title: 'New Task Submitted',
    message: 'Acme Corporation submitted a new task "Annual Sustainability Impact Report Infographic".',
    task_id: 'task-104',
    read: false,
    created_at: '2026-09-27T07:30:00Z',
  },
  {
    id: 'notif-3',
    recipient_id: DEMO_USERS.employee_karthik.id,
    type: 'TASK_ASSIGNED',
    title: 'New Task Assignment',
    message: 'You have been assigned to "Enterprise Single Sign-On (SSO) OAuth2 Setup". Please accept or reject.',
    task_id: 'task-106',
    read: false,
    created_at: '2026-09-27T08:00:00Z',
  },
  {
    id: 'notif-4',
    recipient_id: DEMO_USERS.employee_marcus.id,
    type: 'REVISION_REQUESTED',
    title: 'Revision Requested',
    message: 'Admin requested adjustments on "Product Launch 4K Teaser Video".',
    task_id: 'task-103',
    read: false,
    created_at: '2026-09-27T09:40:00Z',
  },
  {
    id: 'notif-5',
    recipient_id: DEMO_USERS.client.id,
    type: 'FINAL_DELIVERY_READY',
    title: 'Deliverables Ready!',
    message: 'Your task "Customer Onboarding Video Walkthrough" deliverables are ready for download.',
    task_id: 'task-105',
    read: false,
    created_at: '2026-09-26T17:00:00Z',
  },
]

const DEFAULT_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    thread_id: 'task-101',
    sender_id: DEMO_USERS.client.id,
    sender_name: 'Sarah Jenkins',
    sender_role: 'CLIENT',
    content: 'Hi Elena, thrilled to work with you on this redesign! We uploaded our new design brand guidelines in the files section.',
    created_at: '2026-09-20T10:15:00Z',
  },
  {
    id: 'msg-2',
    thread_id: 'task-101',
    sender_id: DEMO_USERS.employee_elena.id,
    sender_name: 'Elena Rostova',
    sender_role: 'EMPLOYEE',
    content: 'Thanks Sarah! I reviewed the brand guidelines. The typography scale and card radii look fantastic. Starting on wireframes today.',
    created_at: '2026-09-20T11:05:00Z',
  },
  {
    id: 'msg-3',
    thread_id: 'task-102',
    sender_id: DEMO_USERS.employee_karthik.id,
    sender_name: 'Karthik Raja',
    sender_role: 'EMPLOYEE',
    content: 'Completed the OAuth callback handler and the webhook signatures validation. Submitting for final review now.',
    created_at: '2026-09-27T08:14:00Z',
  },
]

const DEFAULT_FILES: TaskFile[] = [
  {
    id: 'file-1',
    task_id: 'task-101',
    name: 'Brand_Identity_Guidelines_2026.pdf',
    size: '12.4 MB',
    type: 'pdf',
    url: '#',
    category: 'CLIENT_ATTACHMENT',
    uploaded_by: 'Sarah Jenkins',
    created_at: '2026-09-20T09:10:00Z',
  },
  {
    id: 'file-2',
    task_id: 'task-101',
    name: 'Mobile_Design_System_Tokens.fig',
    size: '34.8 MB',
    type: 'figma',
    url: '#',
    category: 'WORK_FILE',
    uploaded_by: 'Elena Rostova',
    created_at: '2026-09-25T16:20:00Z',
  },
  {
    id: 'file-3',
    task_id: 'task-102',
    name: 'API_Postman_Collection_v2.json',
    size: '1.2 MB',
    type: 'json',
    url: '#',
    category: 'FINAL_DELIVERABLE',
    uploaded_by: 'Karthik Raja',
    created_at: '2026-09-27T08:10:00Z',
  },
  {
    id: 'file-4',
    task_id: 'task-105',
    name: 'Onboarding_Tutorial_Part1_4K.mp4',
    size: '412.5 MB',
    type: 'video',
    url: '#',
    category: 'FINAL_DELIVERABLE',
    uploaded_by: 'Marcus Vance',
    created_at: '2026-09-26T16:45:00Z',
  },
]

// Storage helper
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const data = localStorage.getItem(`taskflow_${key}`)
    const parsed = data ? JSON.parse(data) : fallback

    if (!Array.isArray(parsed)) return parsed as T

    const seenIds = new Set<string>()
    const seenTaskNumbers = new Set<string>()
    const unique = parsed.filter(item => {
      if (!item || typeof item !== 'object') return true
      const record = item as { id?: string; task_number?: string }
      const hasDuplicateId = Boolean(record.id && seenIds.has(record.id))
      const hasDuplicateTaskNumber = Boolean(record.task_number && seenTaskNumbers.has(record.task_number))
      if (hasDuplicateId || hasDuplicateTaskNumber) return false
      if (record.id) seenIds.add(record.id)
      if (record.task_number) seenTaskNumbers.add(record.task_number)
      return true
    })

    if (unique.length !== parsed.length) {
      localStorage.setItem(`taskflow_${key}`, JSON.stringify(unique))
    }

    return unique as T
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`taskflow_${key}`, JSON.stringify(data))
    window.dispatchEvent(new Event('taskflow_store_updated'))
  } catch (e) {
    console.error('Storage save error:', e)
  }
}

export class TaskFlowStore {
  // Tasks
  static getTasks(): Task[] {
    const tasks = loadFromStorage('tasks', DEFAULT_TASKS)

    if (typeof window === 'undefined') return tasks

    try {
      const storedCompany = window.localStorage.getItem('taskflow_company_profile')
      if (!storedCompany) return tasks

      const company = JSON.parse(storedCompany) as { name?: string }
      const companyName = company.name?.trim()
      if (!companyName) return tasks

      let changed = false
      const migratedTasks = tasks.map(task => {
        const isLegacyClientTask =
          task.created_by === DEMO_USERS.client.id ||
          task.client_email === DEMO_USERS.client.email ||
          task.client_name?.startsWith('Acme Corporation')

        if (!isLegacyClientTask || task.client_name === companyName) return task

        changed = true
        return {
          ...task,
          client_name: companyName,
          client_email: task.client_email || DEMO_USERS.client.email,
          updated_at: new Date().toISOString(),
        }
      })

      if (changed) {
        window.localStorage.setItem('taskflow_tasks', JSON.stringify(migratedTasks))
      }

      return migratedTasks
    } catch {
      return tasks
    }
  }

  static getTask(id: string): Task | undefined {
    return this.getTasks().find(t => t.id === id || t.task_number === id)
  }

  static saveTasks(tasks: Task[]) {
    saveToStorage('tasks', tasks)
  }

  static deleteTask(taskId: string): boolean {
    const tasks = this.getTasks()
    const nextTasks = tasks.filter(task => task.id !== taskId && task.task_number !== taskId)
    if (nextTasks.length === tasks.length) return false

    this.saveTasks(nextTasks)
    return true
  }

  static createTask(taskData: Partial<Task>): Task {
    const tasks = this.getTasks()
    const taskCount = tasks.length + 101
    const newTask: Task = {
      id: `task-${Date.now()}`,
      task_number: `TSK-${taskCount}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      company_id: taskData.company_id || 'comp-acme',
      created_by: taskData.created_by || DEMO_USERS.client.id,
      task_type_id: taskData.task_type_id || 'tt-dev',
      department_id: taskData.department_id || 'dept-dev',
      priority: taskData.priority || 'MEDIUM',
      status: 'SUBMITTED',
      progress_percentage: 0,
      client_name: taskData.client_name || taskData.client_email || 'Client organization',
      client_email: taskData.client_email || '',
      required_skills: taskData.required_skills || [],
      start_date: taskData.start_date || new Date().toISOString().split('T')[0],
      end_date: taskData.end_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Auto-calculate AI match for recommendation
    const recommendation = this.calculateBestExpertMatch(newTask)
    if (recommendation) {
      newTask.match_score = recommendation.score
    }

    tasks.unshift(newTask)
    this.saveTasks(tasks)

    // Log Activity
    this.addActivity({
      entity_type: 'TASK',
      entity_id: newTask.id,
      action: 'TASK_CREATED',
      actor_name: newTask.client_name,
      actor_role: 'CLIENT',
      description: `Task "${newTask.title}" submitted by ${newTask.client_name}.`,
    })

    // Notify Admin
    this.addNotification({
      recipient_id: DEMO_USERS.admin.id,
      type: 'TASK_CREATED',
      title: 'New Task Submitted',
      message: `${newTask.client_name} submitted task "${newTask.title}".`,
      task_id: newTask.id,
    })

    return newTask
  }

  static updateTaskStatus(taskId: string, newStatus: TaskStatus, note?: string): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index === -1) return null

    const task = tasks[index]
    const oldStatus = task.status
    task.status = newStatus
    task.updated_at = new Date().toISOString()

    if (newStatus === 'COMPLETED') {
      task.completed_at = new Date().toISOString()
      task.progress_percentage = 100
    }

    tasks[index] = task
    this.saveTasks(tasks)

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'STATUS_CHANGED',
      actor_name: 'System',
      actor_role: 'ADMIN',
      description: `Status changed from ${oldStatus} to ${newStatus}${note ? `: ${note}` : ''}`,
    })

    return task
  }

  static assignTask(taskId: string, employeeId: string, assignedBy: string = 'Alex Rivera'): Task | null {
    const tasks = this.getTasks()
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return null

    const employees = this.getEmployees()
    const emp = employees.find(e => e.profile_id === employeeId || e.id === employeeId)
    if (!emp) return null

    const task = tasks[taskIndex]
    task.assigned_employee_id = emp.profile_id
    task.assigned_employee = {
      id: emp.profile_id,
      name: emp.name,
      email: emp.email,
      avatar: emp.avatar,
      title: emp.title,
      workload_percentage: emp.workload_percentage,
    }
    task.status = 'AWAITING_ACCEPTANCE'
    task.updated_at = new Date().toISOString()

    tasks[taskIndex] = task
    this.saveTasks(tasks)

    // Notify Employee
    this.addNotification({
      recipient_id: emp.profile_id,
      type: 'TASK_ASSIGNED',
      title: 'New Task Assignment',
      message: `You were assigned to "${task.title}". Please accept or reject.`,
      task_id: task.id,
    })

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'ASSIGNED',
      actor_name: assignedBy,
      actor_role: 'ADMIN',
      description: `Assigned to expert ${emp.name} by ${assignedBy}.`,
    })

    return task
  }

  static acceptTask(taskId: string, employeeName: string): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index === -1) return null

    const task = tasks[index]
    task.status = 'IN_PROGRESS'
    task.updated_at = new Date().toISOString()
    tasks[index] = task
    this.saveTasks(tasks)

    this.addNotification({
      recipient_id: DEMO_USERS.admin.id,
      type: 'TASK_ACCEPTED',
      title: 'Task Accepted',
      message: `${employeeName} accepted "${task.title}" and started work.`,
      task_id: task.id,
    })

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'ACCEPTED',
      actor_name: employeeName,
      actor_role: 'EMPLOYEE',
      description: `Task accepted and moved to In Progress by ${employeeName}.`,
    })

    return task
  }

  static rejectTask(taskId: string, employeeName: string, reason: string): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index === -1) return null

    const task = tasks[index]
    task.status = 'SUBMITTED' // Reverted to pending assignment queue
    task.assigned_employee_id = undefined
    task.assigned_employee = undefined
    task.updated_at = new Date().toISOString()
    tasks[index] = task
    this.saveTasks(tasks)

    this.addNotification({
      recipient_id: DEMO_USERS.admin.id,
      type: 'TASK_REJECTED',
      title: 'Task Assignment Declined',
      message: `${employeeName} declined "${task.title}". Reason: ${reason}`,
      task_id: task.id,
    })

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'REJECTED',
      actor_name: employeeName,
      actor_role: 'EMPLOYEE',
      description: `Assignment declined by ${employeeName}. Reason: ${reason}. Returned to queue.`,
    })

    return task
  }

  static updateProgress(taskId: string, progress: number, note: string, authorName: string): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index === -1) return null

    const task = tasks[index]
    task.progress_percentage = progress
    task.updated_at = new Date().toISOString()
    tasks[index] = task
    this.saveTasks(tasks)

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'PROGRESS_UPDATE',
      actor_name: authorName,
      actor_role: 'EMPLOYEE',
      description: `Progress updated to ${progress}%: "${note}"`,
    })

    return task
  }

  static submitForReview(taskId: string, notes: string, employeeName: string): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index === -1) return null

    const task = tasks[index]
    task.status = 'SUBMITTED_FOR_REVIEW'
    task.progress_percentage = 100
    task.submission_notes = notes
    task.updated_at = new Date().toISOString()
    tasks[index] = task
    this.saveTasks(tasks)

    // Notify Admin
    this.addNotification({
      recipient_id: DEMO_USERS.admin.id,
      type: 'TASK_SUBMITTED_FOR_REVIEW',
      title: 'Work Submitted for Review',
      message: `${employeeName} completed deliverables for "${task.title}". Review required.`,
      task_id: task.id,
    })

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'SUBMITTED_FOR_REVIEW',
      actor_name: employeeName,
      actor_role: 'EMPLOYEE',
      description: `Deliverables submitted for admin review by ${employeeName}.`,
    })

    return task
  }

  static adminApproveReview(taskId: string, adminName: string = 'Alex Rivera'): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index === -1) return null

    const task = tasks[index]
    task.status = 'FINAL_DELIVERY'
    task.updated_at = new Date().toISOString()
    tasks[index] = task
    this.saveTasks(tasks)

    // Notify Client
    this.addNotification({
      recipient_id: task.created_by,
      type: 'FINAL_DELIVERY_READY',
      title: 'Deliverables Approved & Ready',
      message: `Your project "${task.title}" has been reviewed and approved by our team. Final files are available!`,
      task_id: task.id,
    })

    // Notify Employee
    if (task.assigned_employee_id) {
      this.addNotification({
        recipient_id: task.assigned_employee_id,
        type: 'TASK_APPROVED',
        title: 'Review Approved!',
        message: `Admin ${adminName} approved your deliverables for "${task.title}". Great work!`,
        task_id: task.id,
      })
    }

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'APPROVED',
      actor_name: adminName,
      actor_role: 'ADMIN',
      description: `Deliverables reviewed and approved by ${adminName}. Final delivery unlocked for client.`,
    })

    return task
  }

  static adminRequestRevision(taskId: string, reason: string, adminName: string = 'Alex Rivera'): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index === -1) return null

    const task = tasks[index]
    task.status = 'REVISION_REQUIRED'
    task.revision_reason = reason
    task.updated_at = new Date().toISOString()
    tasks[index] = task
    this.saveTasks(tasks)

    // Notify Employee
    if (task.assigned_employee_id) {
      this.addNotification({
        recipient_id: task.assigned_employee_id,
        type: 'REVISION_REQUESTED',
        title: 'Revision Requested',
        message: `Revision requested on "${task.title}": ${reason}`,
        task_id: task.id,
      })
    }

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'REVISION_REQUESTED',
      actor_name: adminName,
      actor_role: 'ADMIN',
      description: `Revision requested by ${adminName}: "${reason}".`,
    })

    return task
  }

  static clientCompleteTask(taskId: string, clientName: string): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index === -1) return null

    const task = tasks[index]
    task.status = 'COMPLETED'
    task.completed_at = new Date().toISOString()
    task.updated_at = new Date().toISOString()
    tasks[index] = task
    this.saveTasks(tasks)

    this.addNotification({
      recipient_id: DEMO_USERS.admin.id,
      type: 'TASK_COMPLETED',
      title: 'Task Successfully Completed',
      message: `${clientName} confirmed receipt of final deliverables for "${task.title}".`,
      task_id: task.id,
    })

    this.addActivity({
      entity_type: 'TASK',
      entity_id: task.id,
      action: 'COMPLETED',
      actor_name: clientName,
      actor_role: 'CLIENT',
      description: `Task accepted and completed by client ${clientName}.`,
    })

    return task
  }

  // Employees & Matching Engine
  static getEmployees() {
    return loadFromStorage('employees', DEFAULT_EMPLOYEES)
  }

  static calculateBestExpertMatch(task: Partial<Task>): { employee: typeof DEFAULT_EMPLOYEES[0]; score: number; reasons: string[] } | null {
    const employees = this.getEmployees()
    const reqSkills = task.required_skills || []
    const deptId = task.department_id

    let bestScore = -1
    let bestMatch: (typeof DEFAULT_EMPLOYEES)[0] | null = null
    let bestReasons: string[] = []

    employees.forEach(emp => {
      let score = 0
      const reasons: string[] = []

      // 1. Department match: up to 25 pts
      if (emp.department_id === deptId) {
        score += 25
        reasons.push('Primary department match (+25%)')
      }

      // 2. Skill match: up to 45 pts
      if (reqSkills.length > 0) {
        const matchingSkills = reqSkills.filter(s => emp.skills.includes(s))
        const skillRatio = matchingSkills.length / reqSkills.length
        const skillPts = Math.round(skillRatio * 45)
        score += skillPts
        if (matchingSkills.length > 0) {
          reasons.push(`Matched ${matchingSkills.length}/${reqSkills.length} required skills: ${matchingSkills.join(', ')} (+${skillPts}%)`)
        }
      } else {
        score += 30
      }

      // 3. Workload availability: up to 20 pts
      const availabilityFactor = Math.max(0, (100 - emp.workload_percentage) / 100)
      const workloadPts = Math.round(availabilityFactor * 20)
      score += workloadPts
      reasons.push(`Workload capacity ${100 - emp.workload_percentage}% available (+${workloadPts}%)`)

      // 4. Experience bonus: up to 10 pts
      const expPts = Math.min(10, (emp.experience_years || 5) * 1.5)
      score += Math.round(expPts)
      reasons.push(`${emp.experience_years} years domain expertise (+${Math.round(expPts)}%)`)

      if (score > bestScore) {
        bestScore = score
        bestMatch = emp
        bestReasons = reasons
      }
    })

    if (!bestMatch) return null
    return {
      employee: bestMatch,
      score: Math.min(99, Math.max(65, bestScore)),
      reasons: bestReasons,
    }
  }

  // Notifications
  static getNotifications(recipientId?: string): Notification[] {
    const all = loadFromStorage('notifications', DEFAULT_NOTIFICATIONS)
    if (!recipientId) return all
    return all.filter(n => n.recipient_id === recipientId)
  }

  static addNotification(notif: Partial<Notification>) {
    const all = this.getNotifications()
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recipient_id: notif.recipient_id || DEMO_USERS.admin.id,
      type: notif.type || 'TASK_CREATED',
      title: notif.title || 'Notification',
      message: notif.message || '',
      task_id: notif.task_id,
      read: false,
      created_at: new Date().toISOString(),
    }
    all.unshift(newNotif)
    saveToStorage('notifications', all)
  }

  static markNotificationRead(id: string) {
    const all = this.getNotifications()
    const notif = all.find(n => n.id === id)
    if (notif) {
      notif.read = true
      saveToStorage('notifications', all)
    }
  }

  static markAllNotificationsRead(recipientId: string) {
    const all = this.getNotifications()
    all.forEach(n => {
      if (n.recipient_id === recipientId) n.read = true
    })
    saveToStorage('notifications', all)
  }

  // Messages
  static getMessages(threadId: string): Message[] {
    const all = loadFromStorage('messages', DEFAULT_MESSAGES)
    return all.filter(m => m.thread_id === threadId)
  }

  static addMessage(msg: Partial<Message>): Message {
    const all = loadFromStorage('messages', DEFAULT_MESSAGES)
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      thread_id: msg.thread_id || 'general',
      sender_id: msg.sender_id || DEMO_USERS.client.id,
      sender_name: msg.sender_name || 'Anonymous',
      sender_role: msg.sender_role || 'CLIENT',
      content: msg.content || '',
      created_at: new Date().toISOString(),
    }
    all.push(newMsg)
    saveToStorage('messages', all)
    return newMsg
  }

  // Files
  static getFiles(taskId?: string): TaskFile[] {
    const all = loadFromStorage('files', DEFAULT_FILES)
    if (!taskId) return all
    return all.filter(f => f.task_id === taskId)
  }

  static addFile(file: Partial<TaskFile>): TaskFile {
    const all = loadFromStorage('files', DEFAULT_FILES)
    const newFile: TaskFile = {
      id: `file-${Date.now()}`,
      task_id: file.task_id || 'task-101',
      name: file.name || 'Untitled Document',
      size: file.size || '1.0 MB',
      type: file.type || 'file',
      url: file.url || '#',
      category: file.category || 'WORK_FILE',
      uploaded_by: file.uploaded_by || 'Alex Rivera',
      created_at: new Date().toISOString(),
    }
    all.unshift(newFile)
    saveToStorage('files', all)
    return newFile
  }

  // Activities
  static getActivities(taskId?: string): ActivityLog[] {
    const all = loadFromStorage('activities', [
      {
        id: 'act-1',
        entity_type: 'TASK',
        entity_id: 'task-102',
        action: 'SUBMITTED_FOR_REVIEW',
        actor_name: 'Karthik Raja',
        actor_role: 'EMPLOYEE',
        description: 'Deliverables submitted for review by Karthik Raja.',
        created_at: '2026-09-27T08:15:00Z',
      },
      {
        id: 'act-2',
        entity_type: 'TASK',
        entity_id: 'task-106',
        action: 'ASSIGNED',
        actor_name: 'Alex Rivera',
        actor_role: 'ADMIN',
        description: 'Auto-assigned to Karthik Raja (97% AI Expert Match Score).',
        created_at: '2026-09-27T08:00:00Z',
      },
      {
        id: 'act-3',
        entity_type: 'TASK',
        entity_id: 'task-104',
        action: 'TASK_CREATED',
        actor_name: 'Sarah Jenkins',
        actor_role: 'CLIENT',
        description: 'New task created by Acme Corporation.',
        created_at: '2026-09-27T07:30:00Z',
      },
    ])
    if (!taskId) return all
    return all.filter(a => a.entity_id === taskId)
  }

  static addActivity(act: Partial<ActivityLog>) {
    const all = this.getActivities()
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      entity_type: act.entity_type || 'TASK',
      entity_id: act.entity_id || '',
      action: act.action || 'UPDATE',
      actor_name: act.actor_name || 'System',
      actor_role: act.actor_role || 'ADMIN',
      description: act.description || '',
      created_at: new Date().toISOString(),
    }
    all.unshift(newAct)
    saveToStorage('activities', all)
  }

  static getDepartments(): Department[] {
    return DEFAULT_DEPARTMENTS
  }
}
