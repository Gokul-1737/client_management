-- TaskFlow AI - Initial Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('CLIENT', 'ADMIN', 'EMPLOYEE');

CREATE TYPE task_status AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'ANALYZING',
  'ASSIGNED',
  'AWAITING_ACCEPTANCE',
  'ACCEPTED',
  'REJECTED',
  'IN_PROGRESS',
  'SUBMITTED_FOR_REVIEW',
  'REVISION_REQUIRED',
  'RESUBMITTED',
  'APPROVED',
  'FINAL_DELIVERY',
  'COMPLETED',
  'CLOSED'
);

CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

CREATE TYPE notification_type AS ENUM (
  'TASK_CREATED',
  'TASK_ASSIGNED',
  'TASK_ACCEPTED',
  'TASK_REJECTED',
  'TASK_STARTED',
  'PROGRESS_UPDATED',
  'TASK_SUBMITTED_FOR_REVIEW',
  'REVISION_REQUESTED',
  'TASK_RESUBMITTED',
  'TASK_APPROVED',
  'FINAL_DELIVERY_READY',
  'TASK_COMPLETED',
  'DEADLINE_REMINDER',
  'MESSAGE_RECEIVED'
);

CREATE TYPE file_category AS ENUM (
  'CLIENT_ATTACHMENT',
  'WORK_FILE',
  'REVIEW_FILE',
  'FINAL_DELIVERABLE'
);

CREATE TYPE assignment_status AS ENUM (
  'PENDING',
  'ACCEPTED',
  'REJECTED'
);

CREATE TYPE availability_status AS ENUM (
  'AVAILABLE',
  'BUSY',
  'UNAVAILABLE'
);

-- =============================================
-- PROFILES
-- =============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'CLIENT',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- COMPANIES
-- =============================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  address TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE company_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, profile_id)
);

-- =============================================
-- DEPARTMENTS
-- =============================================

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#4F46E5',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- SKILLS
-- =============================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- EMPLOYEE PROFILES
-- =============================================

CREATE TABLE employee_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  title TEXT,
  bio TEXT,
  availability_status availability_status NOT NULL DEFAULT 'AVAILABLE',
  workload_percentage INTEGER NOT NULL DEFAULT 0 CHECK (workload_percentage >= 0 AND workload_percentage <= 100),
  max_workload_percentage INTEGER NOT NULL DEFAULT 80,
  active_task_count INTEGER NOT NULL DEFAULT 0,
  experience_years INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE employee_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employee_profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level INTEGER NOT NULL DEFAULT 3 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employee_id, skill_id)
);

-- =============================================
-- TASK TYPES
-- =============================================

CREATE TABLE task_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES departments(id),
  description TEXT,
  required_skills UUID[] DEFAULT '{}',
  estimated_hours INTEGER DEFAULT 8,
  color TEXT DEFAULT '#4F46E5',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TASKS
-- =============================================

CREATE SEQUENCE task_number_seq START WITH 1024;

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_number TEXT NOT NULL UNIQUE DEFAULT ('TASK-' || nextval('task_number_seq')::TEXT),
  company_id UUID REFERENCES companies(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  task_type_id UUID REFERENCES task_types(id),
  task_type_name TEXT,
  priority task_priority NOT NULL DEFAULT 'MEDIUM',
  start_date DATE,
  end_date DATE,
  status task_status NOT NULL DEFAULT 'DRAFT',
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  assigned_employee_id UUID REFERENCES profiles(id),
  required_skills UUID[] DEFAULT '{}',
  required_skill_names TEXT[] DEFAULT '{}',
  additional_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =============================================
-- TASK ASSIGNMENTS
-- =============================================

CREATE TABLE task_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES profiles(id),
  assigned_by UUID NOT NULL REFERENCES profiles(id),
  match_score INTEGER,
  skill_match_percentage INTEGER,
  workload_at_assignment INTEGER,
  status assignment_status NOT NULL DEFAULT 'PENDING',
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TASK STATUS HISTORY
-- =============================================

CREATE TABLE task_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  from_status task_status,
  to_status task_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TASK PROGRESS UPDATES
-- =============================================

CREATE TABLE task_progress_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES profiles(id),
  progress_percentage INTEGER NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TASK COMMENTS
-- =============================================

CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TASK FILES
-- =============================================

CREATE TABLE task_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  category file_category NOT NULL DEFAULT 'CLIENT_ATTACHMENT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TASK REVIEWS
-- =============================================

CREATE TABLE task_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  reviewed_by UUID NOT NULL REFERENCES profiles(id),
  decision TEXT NOT NULL CHECK (decision IN ('APPROVED', 'REVISION_REQUIRED')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- REVISION REQUESTS
-- =============================================

CREATE TABLE revision_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  required_changes TEXT NOT NULL,
  additional_comments TEXT,
  new_deadline DATE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  task_number TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MESSAGE THREADS
-- =============================================

CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  subject TEXT,
  participants UUID[] NOT NULL DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MESSAGES
-- =============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- AUTOMATION RULES
-- =============================================

CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  task_type_id UUID REFERENCES task_types(id),
  department_id UUID REFERENCES departments(id),
  required_skills UUID[] DEFAULT '{}',
  max_employee_workload INTEGER DEFAULT 80,
  priority_weight INTEGER DEFAULT 1,
  deadline_weight INTEGER DEFAULT 1,
  skill_weight INTEGER DEFAULT 1,
  workload_weight INTEGER DEFAULT 1,
  auto_assign BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOGS
-- =============================================

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_assigned_employee_id ON tasks(assigned_employee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_task_status_history_task_id ON task_status_history(task_id);
CREATE INDEX idx_task_files_task_id ON task_files(task_id);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_activity_logs_entity_id ON activity_logs(entity_id);
CREATE INDEX idx_activity_logs_actor_id ON activity_logs(actor_id);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_employee_profiles_updated_at BEFORE UPDATE ON employee_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_message_threads_updated_at BEFORE UPDATE ON message_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- PROFILES RLS
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (get_my_role() = 'ADMIN');
CREATE POLICY "Admin can update profiles" ON profiles FOR UPDATE USING (get_my_role() = 'ADMIN');
CREATE POLICY "Employees can view client profiles for assigned tasks" ON profiles FOR SELECT USING (get_my_role() = 'EMPLOYEE');
CREATE POLICY "Anyone can insert own profile" ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- COMPANIES RLS
CREATE POLICY "Clients can view own company" ON companies FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  id IN (SELECT company_id FROM company_members WHERE profile_id = auth.uid())
);
CREATE POLICY "Clients can insert company" ON companies FOR INSERT WITH CHECK (get_my_role() IN ('CLIENT', 'ADMIN'));
CREATE POLICY "Clients can update own company" ON companies FOR UPDATE USING (
  get_my_role() = 'ADMIN' OR
  id IN (SELECT company_id FROM company_members WHERE profile_id = auth.uid())
);

-- COMPANY MEMBERS RLS
CREATE POLICY "Members can view own memberships" ON company_members FOR SELECT USING (
  get_my_role() = 'ADMIN' OR profile_id = auth.uid()
);
CREATE POLICY "Clients can join company" ON company_members FOR INSERT WITH CHECK (
  profile_id = auth.uid() OR get_my_role() = 'ADMIN'
);

-- TASKS RLS
CREATE POLICY "Clients can view own tasks" ON tasks FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  created_by = auth.uid() OR
  assigned_employee_id = auth.uid()
);
CREATE POLICY "Clients can insert tasks" ON tasks FOR INSERT WITH CHECK (
  get_my_role() IN ('CLIENT', 'ADMIN')
);
CREATE POLICY "Admin can update all tasks" ON tasks FOR UPDATE USING (
  get_my_role() = 'ADMIN' OR
  (get_my_role() = 'EMPLOYEE' AND assigned_employee_id = auth.uid())
);

-- TASK ASSIGNMENTS RLS
CREATE POLICY "Task assignments visible to involved parties" ON task_assignments FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  employee_id = auth.uid() OR
  task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid())
);
CREATE POLICY "Admin can insert task assignments" ON task_assignments FOR INSERT WITH CHECK (get_my_role() = 'ADMIN');
CREATE POLICY "Employee can update own assignment" ON task_assignments FOR UPDATE USING (
  get_my_role() = 'ADMIN' OR employee_id = auth.uid()
);

-- TASK STATUS HISTORY RLS
CREATE POLICY "Task status history visible to involved parties" ON task_status_history FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid() OR assigned_employee_id = auth.uid())
);
CREATE POLICY "Insert task status history" ON task_status_history FOR INSERT WITH CHECK (
  get_my_role() IN ('ADMIN', 'EMPLOYEE', 'CLIENT')
);

-- TASK PROGRESS UPDATES RLS
CREATE POLICY "Progress updates visible to involved parties" ON task_progress_updates FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid() OR assigned_employee_id = auth.uid())
);
CREATE POLICY "Employees can insert progress updates" ON task_progress_updates FOR INSERT WITH CHECK (
  get_my_role() IN ('EMPLOYEE', 'ADMIN')
);

-- TASK COMMENTS RLS
CREATE POLICY "Task comments visible to involved parties" ON task_comments FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  (task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid() OR assigned_employee_id = auth.uid()) AND NOT is_internal) OR
  (get_my_role() IN ('ADMIN', 'EMPLOYEE') AND is_internal)
);
CREATE POLICY "Involved parties can comment" ON task_comments FOR INSERT WITH CHECK (
  author_id = auth.uid()
);

-- TASK FILES RLS
CREATE POLICY "Task files visible to involved parties" ON task_files FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid() OR assigned_employee_id = auth.uid())
);
CREATE POLICY "Involved parties can upload files" ON task_files FOR INSERT WITH CHECK (
  uploaded_by = auth.uid()
);
CREATE POLICY "Admin and uploader can delete files" ON task_files FOR DELETE USING (
  get_my_role() = 'ADMIN' OR uploaded_by = auth.uid()
);

-- TASK REVIEWS RLS
CREATE POLICY "Task reviews visible to involved parties" ON task_reviews FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid() OR assigned_employee_id = auth.uid())
);
CREATE POLICY "Admin can insert reviews" ON task_reviews FOR INSERT WITH CHECK (get_my_role() = 'ADMIN');

-- REVISION REQUESTS RLS
CREATE POLICY "Revision requests visible to involved parties" ON revision_requests FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  task_id IN (SELECT id FROM tasks WHERE created_by = auth.uid() OR assigned_employee_id = auth.uid())
);
CREATE POLICY "Admin can insert revision requests" ON revision_requests FOR INSERT WITH CHECK (get_my_role() = 'ADMIN');

-- NOTIFICATIONS RLS
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can update own notifications (mark read)" ON notifications FOR UPDATE USING (recipient_id = auth.uid());

-- MESSAGES RLS
CREATE POLICY "Thread participants can view messages" ON messages FOR SELECT USING (
  get_my_role() = 'ADMIN' OR
  thread_id IN (SELECT id FROM message_threads WHERE auth.uid() = ANY(participants))
);
CREATE POLICY "Thread participants can send messages" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()
);

-- MESSAGE THREADS RLS
CREATE POLICY "Thread participants can view threads" ON message_threads FOR SELECT USING (
  get_my_role() = 'ADMIN' OR auth.uid() = ANY(participants)
);
CREATE POLICY "Authenticated users can create threads" ON message_threads FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- EMPLOYEE PROFILES RLS
CREATE POLICY "Anyone authenticated can view employee profiles" ON employee_profiles FOR SELECT USING (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Employees can update own profile" ON employee_profiles FOR UPDATE USING (
  profile_id = auth.uid() OR get_my_role() = 'ADMIN'
);
CREATE POLICY "Admin can insert employee profiles" ON employee_profiles FOR INSERT WITH CHECK (
  get_my_role() = 'ADMIN' OR profile_id = auth.uid()
);

-- EMPLOYEE SKILLS RLS
CREATE POLICY "Anyone can view employee skills" ON employee_skills FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Employees can manage own skills" ON employee_skills FOR ALL USING (
  get_my_role() = 'ADMIN' OR
  employee_id IN (SELECT id FROM employee_profiles WHERE profile_id = auth.uid())
);

-- DEPARTMENTS, SKILLS, TASK TYPES (READ PUBLIC, WRITE ADMIN)
CREATE POLICY "Anyone can view departments" ON departments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin manages departments" ON departments FOR ALL USING (get_my_role() = 'ADMIN');

CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin manages skills" ON skills FOR ALL USING (get_my_role() = 'ADMIN');

CREATE POLICY "Anyone can view task types" ON task_types FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin manages task types" ON task_types FOR ALL USING (get_my_role() = 'ADMIN');

-- AUTOMATION RULES RLS
CREATE POLICY "Admin can manage automation rules" ON automation_rules FOR ALL USING (get_my_role() = 'ADMIN');
CREATE POLICY "Anyone can view automation rules" ON automation_rules FOR SELECT USING (auth.uid() IS NOT NULL);

-- ACTIVITY LOGS RLS
CREATE POLICY "Admin can view all activity logs" ON activity_logs FOR SELECT USING (get_my_role() = 'ADMIN');
CREATE POLICY "Users can view own activity" ON activity_logs FOR SELECT USING (actor_id = auth.uid());
CREATE POLICY "System can insert activity logs" ON activity_logs FOR INSERT WITH CHECK (TRUE);
