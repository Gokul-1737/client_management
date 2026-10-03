import { TaskStatus, TaskPriority, NotificationType } from './types'

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  ANALYZING: 'Analyzing',
  ASSIGNED: 'Assigned',
  AWAITING_ACCEPTANCE: 'Awaiting Acceptance',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  IN_PROGRESS: 'In Progress',
  SUBMITTED_FOR_REVIEW: 'Under Review',
  REVISION_REQUIRED: 'Revision Required',
  RESUBMITTED: 'Resubmitted',
  APPROVED: 'Approved',
  FINAL_DELIVERY: 'Final Delivery',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
}

export const TASK_STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; border: string; dot: string }> = {
  DRAFT: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  SUBMITTED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  ANALYZING: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  ASSIGNED: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  AWAITING_ACCEPTANCE: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  ACCEPTED: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  REJECTED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  SUBMITTED_FOR_REVIEW: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  REVISION_REQUIRED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  RESUBMITTED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  FINAL_DELIVERY: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  CLOSED: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400' },
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  LOW: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  MEDIUM: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  HIGH: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  URGENT: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
}

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
  TASK_CREATED: 'Task Created',
  TASK_ASSIGNED: 'Task Assigned',
  TASK_ACCEPTED: 'Task Accepted',
  TASK_REJECTED: 'Task Rejected',
  TASK_STARTED: 'Task Started',
  PROGRESS_UPDATED: 'Progress Updated',
  TASK_SUBMITTED_FOR_REVIEW: 'Submitted for Review',
  REVISION_REQUESTED: 'Revision Requested',
  TASK_RESUBMITTED: 'Task Resubmitted',
  TASK_APPROVED: 'Task Approved',
  FINAL_DELIVERY_READY: 'Final Delivery Ready',
  TASK_COMPLETED: 'Task Completed',
  DEADLINE_REMINDER: 'Deadline Reminder',
  MESSAGE_RECEIVED: 'New Message',
}

export const TASK_TYPE_OPTIONS = [
  { value: 'Software Development', label: 'Software Development' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Poster Design', label: 'Poster Design' },
  { value: 'Video Editing', label: 'Video Editing' },
  { value: 'Graphic Design', label: 'Graphic Design' },
  { value: 'Content Writing', label: 'Content Writing' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Other', label: 'Other' },
]

export const SKILL_OPTIONS = [
  { value: 'React', label: 'React' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'PostgreSQL', label: 'PostgreSQL' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'Figma', label: 'Figma' },
  { value: 'Photoshop', label: 'Photoshop' },
  { value: 'Illustrator', label: 'Illustrator' },
  { value: 'Premiere Pro', label: 'Premiere Pro' },
  { value: 'After Effects', label: 'After Effects' },
  { value: 'Video Editing', label: 'Video Editing' },
  { value: 'Motion Graphics', label: 'Motion Graphics' },
  { value: 'Graphic Design', label: 'Graphic Design' },
  { value: 'UI Design', label: 'UI Design' },
  { value: 'UX Research', label: 'UX Research' },
  { value: 'SEO', label: 'SEO' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Content Writing', label: 'Content Writing' },
  { value: 'Data Analysis', label: 'Data Analysis' },
]

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
]

export const TASK_STATUS_FLOW: Record<TaskStatus, TaskStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['ANALYZING'],
  ANALYZING: ['ASSIGNED'],
  ASSIGNED: ['AWAITING_ACCEPTANCE'],
  AWAITING_ACCEPTANCE: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['IN_PROGRESS'],
  REJECTED: ['ASSIGNED'],
  IN_PROGRESS: ['SUBMITTED_FOR_REVIEW'],
  SUBMITTED_FOR_REVIEW: ['APPROVED', 'REVISION_REQUIRED'],
  REVISION_REQUIRED: ['RESUBMITTED'],
  RESUBMITTED: ['APPROVED', 'REVISION_REQUIRED'],
  APPROVED: ['FINAL_DELIVERY'],
  FINAL_DELIVERY: ['COMPLETED'],
  COMPLETED: ['CLOSED'],
  CLOSED: [],
}

export const TIMELINE_STEPS: Array<{ status: TaskStatus; label: string }> = [
  { status: 'SUBMITTED', label: 'Submitted' },
  { status: 'ANALYZING', label: 'Analyzing' },
  { status: 'ASSIGNED', label: 'Assigned' },
  { status: 'ACCEPTED', label: 'Accepted' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'SUBMITTED_FOR_REVIEW', label: 'Under Review' },
  { status: 'APPROVED', label: 'Approved' },
  { status: 'COMPLETED', label: 'Completed' },
]

export const STATUS_ORDER: Record<TaskStatus, number> = {
  DRAFT: 0,
  SUBMITTED: 1,
  ANALYZING: 2,
  ASSIGNED: 3,
  AWAITING_ACCEPTANCE: 3,
  ACCEPTED: 4,
  REJECTED: 3,
  IN_PROGRESS: 5,
  SUBMITTED_FOR_REVIEW: 6,
  REVISION_REQUIRED: 6,
  RESUBMITTED: 6,
  APPROVED: 7,
  FINAL_DELIVERY: 7,
  COMPLETED: 8,
  CLOSED: 9,
}

export const REJECTION_REASONS = [
  { value: 'UNAVAILABLE', label: 'Unavailable during task period' },
  { value: 'SKILL_MISMATCH', label: 'Skill mismatch' },
  { value: 'DEADLINE_CONFLICT', label: 'Deadline conflict' },
  { value: 'WORKLOAD', label: 'Current workload too high' },
  { value: 'OTHER', label: 'Other reason' },
]
