-- TaskFlow AI - Seed Data
-- Run AFTER 001_initial_schema.sql

-- =============================================
-- DEPARTMENTS
-- =============================================

INSERT INTO departments (id, name, description, color) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Development', 'Software development team', '#4F46E5'),
  ('d1000000-0000-0000-0000-000000000002', 'Video Editing', 'Video production and editing team', '#7C3AED'),
  ('d1000000-0000-0000-0000-000000000003', 'Graphic Design', 'Graphic design and branding team', '#DB2777'),
  ('d1000000-0000-0000-0000-000000000004', 'UI/UX Design', 'User interface and experience design', '#0891B2'),
  ('d1000000-0000-0000-0000-000000000005', 'Marketing', 'Digital marketing and campaigns', '#D97706'),
  ('d1000000-0000-0000-0000-000000000006', 'Content', 'Content writing and strategy', '#059669'),
  ('d1000000-0000-0000-0000-000000000007', 'Data Analytics', 'Data analysis and visualization', '#DC2626');

-- =============================================
-- SKILLS
-- =============================================

INSERT INTO skills (id, name, category) VALUES
  ('s1000000-0000-0000-0000-000000000001', 'React', 'Development'),
  ('s1000000-0000-0000-0000-000000000002', 'Node.js', 'Development'),
  ('s1000000-0000-0000-0000-000000000003', 'TypeScript', 'Development'),
  ('s1000000-0000-0000-0000-000000000004', 'Python', 'Development'),
  ('s1000000-0000-0000-0000-000000000005', 'PostgreSQL', 'Development'),
  ('s1000000-0000-0000-0000-000000000006', 'Figma', 'Design'),
  ('s1000000-0000-0000-0000-000000000007', 'Photoshop', 'Design'),
  ('s1000000-0000-0000-0000-000000000008', 'Illustrator', 'Design'),
  ('s1000000-0000-0000-0000-000000000009', 'Premiere Pro', 'Video'),
  ('s1000000-0000-0000-0000-000000000010', 'After Effects', 'Video'),
  ('s1000000-0000-0000-0000-000000000011', 'Video Editing', 'Video'),
  ('s1000000-0000-0000-0000-000000000012', 'Motion Graphics', 'Video'),
  ('s1000000-0000-0000-0000-000000000013', 'SEO', 'Marketing'),
  ('s1000000-0000-0000-0000-000000000014', 'Content Writing', 'Content'),
  ('s1000000-0000-0000-0000-000000000015', 'Data Analysis', 'Data'),
  ('s1000000-0000-0000-0000-000000000016', 'UI Design', 'Design'),
  ('s1000000-0000-0000-0000-000000000017', 'UX Research', 'Design'),
  ('s1000000-0000-0000-0000-000000000018', 'Graphic Design', 'Design'),
  ('s1000000-0000-0000-0000-000000000019', 'Digital Marketing', 'Marketing'),
  ('s1000000-0000-0000-0000-000000000020', 'Next.js', 'Development');

-- =============================================
-- TASK TYPES
-- =============================================

INSERT INTO task_types (id, name, department_id, description, required_skills, color) VALUES
  ('tt000000-0000-0000-0000-000000000001', 'Software Development', 'd1000000-0000-0000-0000-000000000001', 'Web and software development projects',
    ARRAY['s1000000-0000-0000-0000-000000000001'::UUID, 's1000000-0000-0000-0000-000000000002'::UUID, 's1000000-0000-0000-0000-000000000003'::UUID], '#4F46E5'),
  ('tt000000-0000-0000-0000-000000000002', 'UI/UX Design', 'd1000000-0000-0000-0000-000000000004', 'Interface and experience design',
    ARRAY['s1000000-0000-0000-0000-000000000006'::UUID, 's1000000-0000-0000-0000-000000000016'::UUID, 's1000000-0000-0000-0000-000000000017'::UUID], '#0891B2'),
  ('tt000000-0000-0000-0000-000000000003', 'Video Editing', 'd1000000-0000-0000-0000-000000000002', 'Professional video editing and production',
    ARRAY['s1000000-0000-0000-0000-000000000009'::UUID, 's1000000-0000-0000-0000-000000000010'::UUID, 's1000000-0000-0000-0000-000000000011'::UUID], '#7C3AED'),
  ('tt000000-0000-0000-0000-000000000004', 'Graphic Design', 'd1000000-0000-0000-0000-000000000003', 'Graphic design, branding and visual assets',
    ARRAY['s1000000-0000-0000-0000-000000000007'::UUID, 's1000000-0000-0000-0000-000000000008'::UUID, 's1000000-0000-0000-0000-000000000018'::UUID], '#DB2777'),
  ('tt000000-0000-0000-0000-000000000005', 'Poster Design', 'd1000000-0000-0000-0000-000000000003', 'Marketing poster and print design',
    ARRAY['s1000000-0000-0000-0000-000000000007'::UUID, 's1000000-0000-0000-0000-000000000018'::UUID], '#EC4899'),
  ('tt000000-0000-0000-0000-000000000006', 'Content Writing', 'd1000000-0000-0000-0000-000000000006', 'Blog posts, articles, and copywriting',
    ARRAY['s1000000-0000-0000-0000-000000000014'::UUID], '#059669'),
  ('tt000000-0000-0000-0000-000000000007', 'Digital Marketing', 'd1000000-0000-0000-0000-000000000005', 'Digital marketing campaigns and strategy',
    ARRAY['s1000000-0000-0000-0000-000000000013'::UUID, 's1000000-0000-0000-0000-000000000019'::UUID], '#D97706'),
  ('tt000000-0000-0000-0000-000000000008', 'Data Analysis', 'd1000000-0000-0000-0000-000000000007', 'Data analysis, reporting and visualization',
    ARRAY['s1000000-0000-0000-0000-000000000015'::UUID, 's1000000-0000-0000-0000-000000000004'::UUID], '#DC2626'),
  ('tt000000-0000-0000-0000-000000000009', 'Other', NULL, 'Other task types', ARRAY[]::UUID[], '#64748B');

-- =============================================
-- AUTOMATION RULES
-- =============================================

INSERT INTO automation_rules (name, task_type_id, department_id, required_skills, max_employee_workload, auto_assign, is_active) VALUES
  ('Video Editing Auto-Route', 'tt000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002',
    ARRAY['s1000000-0000-0000-0000-000000000009'::UUID, 's1000000-0000-0000-0000-000000000010'::UUID], 80, false, true),
  ('Software Dev Auto-Route', 'tt000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
    ARRAY['s1000000-0000-0000-0000-000000000001'::UUID, 's1000000-0000-0000-0000-000000000002'::UUID], 80, false, true),
  ('Graphic Design Auto-Route', 'tt000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003',
    ARRAY['s1000000-0000-0000-0000-000000000007'::UUID, 's1000000-0000-0000-0000-000000000018'::UUID], 80, false, true),
  ('UI/UX Auto-Route', 'tt000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000004',
    ARRAY['s1000000-0000-0000-0000-000000000006'::UUID, 's1000000-0000-0000-0000-000000000016'::UUID], 80, false, true);

-- NOTE: After running this, create users through Supabase Auth and then
-- run the 003_demo_data.sql script with the actual user IDs
