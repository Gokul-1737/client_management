-- Create the client's organization during auth signup.
-- This covers email-confirmation flows where the browser cannot write the
-- company row until a session exists.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_company_id UUID;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''), split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'CLIENT'::user_role),
    NULLIF(NEW.raw_user_meta_data ->> 'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();

  IF NULLIF(NEW.raw_user_meta_data ->> 'company_name', '') IS NOT NULL THEN
    INSERT INTO public.companies (name, created_by)
    VALUES (NEW.raw_user_meta_data ->> 'company_name', NEW.id)
    RETURNING id INTO new_company_id;

    INSERT INTO public.company_members (company_id, profile_id, role)
    VALUES (new_company_id, NEW.id, 'OWNER')
    ON CONFLICT (company_id, profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
