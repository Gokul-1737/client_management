// Probyzaar Technologies - Type Definitions

export type UserRole = 'CLIENT' | 'ADMIN' | 'EMPLOYEE'

export type TaskStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ANALYZING'
  | 'ASSIGNED'
  | 'AWAITING_ACCEPTANCE'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED_FOR_REVIEW'
  | 'REVISION_REQUIRED'
  | 'RESUBMITTED'
  | 'APPROVED'
  | 'FINAL_DELIVERY'
  | 'COMPLETED'
  | 'CLOSED'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type NotificationType =
  | 'TASK_CREATED'
  | 'TASK_ASSIGNED'
  | 'TASK_ACCEPTED'
  | 'TASK_REJECTED'
  | 'TASK_STARTED'
  | 'PROGRESS_UPDATED'
  | 'TASK_SUBMITTED_FOR_REVIEW'
  | 'REVISION_REQUESTED'
  | 'TASK_RESUBMITTED'
  | 'TASK_APPROVED'
  | 'FINAL_DELIVERY_READY'
  | 'TASK_COMPLETED'
  | 'DEADLINE_REMINDER'
  | 'MESSAGE_RECEIVED'

export type FileCategory =
  | 'CLIENT_ATTACHMENT'
  | 'WORK_FILE'
  | 'REVIEW_FILE'
  | 'FINAL_DELIVERABLE'

export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE'

export interface Profile {
  id: string
  email?: string
  full_name?: string
  name?: string
  role?: UserRole
  avatar_url?: string
  avatar?: string
  phone?: string
  company_name?: string
  title?: string
  workload_percentage?: number
  created_at?: string
  updated_at?: string
}

export interface Company {
  id: string
  name: string
  description?: string
  logo_url?: string
  website?: string
  industry?: string
  address?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  description?: string
  color: string
  created_at: string
}

export interface Skill {
  id: string
  name: string
  category?: string
  created_at: string
}

export interface EmployeeProfile {
  id: string
  profile_id: string
  department_id?: string
  title?: string
  bio?: string
  availability_status: AvailabilityStatus
  workload_percentage: number
  max_workload_percentage: number
  active_task_count: number
  experience_years?: number
  created_at: string
  updated_at: string
  profile?: Profile
  department?: Department
  employee_skills?: EmployeeSkill[]
}

export interface EmployeeSkill {
  id: string
  employee_id: string
  skill_id: string
  proficiency_level: number
  skill?: Skill
}

export interface TaskType {
  id: string
  name: string
  department_id?: string
  description?: string
  required_skills: string[]
  estimated_hours?: number
  color: string
  created_at: string
  department?: Department
}

export interface Task {
  id: string
  task_number: string
  company_id?: string
  created_by: string
  title: string
  description: string
  task_type_id?: string
  task_type_name?: string
  department_id?: string
  priority: TaskPriority
  start_date?: string
  end_date?: string
  status: TaskStatus
  progress_percentage: number
  assigned_employee_id?: string
  required_skills?: string[]
  required_skill_names?: string[]
  additional_notes?: string
  rejection_reason?: string
  revision_reason?: string
  submission_notes?: string
  client_name?: string
  client_email?: string
  match_score?: number
  created_at: string
  updated_at: string
  completed_at?: string
  // Joined fields
  company?: Company
  creator?: Profile
  assigned_employee?: Profile
  task_type?: TaskType
}

export interface TaskAssignment {
  id: string
  task_id: string
  employee_id: string
  assigned_by: string
  match_score?: number
  skill_match_percentage?: number
  workload_at_assignment?: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  accepted_at?: string
  rejected_at?: string
  rejection_reason?: string
  created_at: string
  employee?: Profile
  employee_profile?: EmployeeProfile
}

export interface TaskStatusHistory {
  id: string
  task_id: string
  from_status?: TaskStatus
  to_status: TaskStatus
  changed_by?: string
  note?: string
  created_at: string
  changer?: Profile
}

export interface TaskProgressUpdate {
  id: string
  task_id: string
  employee_id: string
  progress_percentage: number
  note?: string
  created_at: string
  employee?: Profile
}

export interface TaskComment {
  id: string
  task_id: string
  author_id: string
  content: string
  is_internal: boolean
  created_at: string
  updated_at: string
  author?: Profile
}

export interface TaskFile {
  id: string
  task_id: string
  uploaded_by: string
  name?: string
  size?: string
  type?: string
  url?: string
  file_name?: string
  file_url?: string
  file_path?: string
  file_type?: string
  file_size?: number
  category: FileCategory
  created_at: string
  uploader?: Profile
}

export interface TaskReview {
  id: string
  task_id: string
  reviewed_by: string
  decision: 'APPROVED' | 'REVISION_REQUIRED'
  notes?: string
  created_at: string
  reviewer?: Profile
}

export interface RevisionRequest {
  id: string
  task_id: string
  requested_by: string
  reason: string
  required_changes: string
  additional_comments?: string
  new_deadline?: string
  resolved_at?: string
  created_at: string
  requester?: Profile
}

export interface Notification {
  id: string
  recipient_id: string
  type: NotificationType
  title: string
  message: string
  task_id?: string
  task_number?: string
  read: boolean
  read_at?: string
  created_at: string
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  sender_name?: string
  sender_role?: string
  content: string
  file_url?: string
  file_name?: string
  read_by?: string[]
  created_at: string
  sender?: Profile
}

export interface MessageThread {
  id: string
  task_id?: string
  subject?: string
  participants: string[]
  created_by: string
  created_at: string
  updated_at: string
  task?: Task
  messages?: Message[]
  last_message?: Message
}

export interface AutomationRule {
  id: string
  name: string
  task_type_id?: string
  department_id?: string
  required_skills: string[]
  max_employee_workload: number
  priority_weight: number
  deadline_weight: number
  skill_weight: number
  workload_weight: number
  auto_assign: boolean
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
  task_type?: TaskType
  department?: Department
}

export interface ActivityLog {
  id: string
  entity_type: string
  entity_id?: string
  action: string
  actor_id?: string
  actor_name?: string
  actor_role?: string
  description?: string
  metadata?: Record<string, unknown>
  created_at: string
  actor?: Profile
}

export interface EmployeeMatchScore {
  employee_id: string
  employee: Profile
  employee_profile: EmployeeProfile
  skill_match_percentage: number
  workload_percentage: number
  availability: AvailabilityStatus
  deadline_compatibility: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  overall_match_score: number
  active_task_count: number
  skills: string[]
}
