-- Allow company owners to recover and manage organizations created before
-- the company membership trigger was installed.

DROP POLICY IF EXISTS "Clients can view own company" ON public.companies;
CREATE POLICY "Clients can view own company" ON public.companies FOR SELECT USING (
  get_my_role() = 'ADMIN'
  OR created_by = auth.uid()
  OR id IN (
    SELECT company_id
    FROM public.company_members
    WHERE profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Clients can update own company" ON public.companies;
CREATE POLICY "Clients can update own company" ON public.companies FOR UPDATE USING (
  get_my_role() = 'ADMIN'
  OR created_by = auth.uid()
  OR id IN (
    SELECT company_id
    FROM public.company_members
    WHERE profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Clients can insert company" ON public.companies;
CREATE POLICY "Clients can insert company" ON public.companies FOR INSERT WITH CHECK (
  get_my_role() IN ('CLIENT', 'ADMIN')
  AND (created_by IS NULL OR created_by = auth.uid() OR get_my_role() = 'ADMIN')
);

DROP POLICY IF EXISTS "Clients can update own membership" ON public.company_members;
CREATE POLICY "Clients can update own membership" ON public.company_members FOR UPDATE USING (
  get_my_role() = 'ADMIN' OR profile_id = auth.uid()
);
