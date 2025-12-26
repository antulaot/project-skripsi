-- 1. Buat Fungsi Helper "Sakti" (SECURITY DEFINER)
-- Fungsi ini berjalan dengan hak akses Admin Database, jadi dia menembus RLS.
-- Gunanya hanya untuk mengecek Role dan Org ID user yang sedang login.

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_my_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Hapus Policy Lama yang menyebabkan Error Recursion
DROP POLICY IF EXISTS "Super Admin access all" ON public.profiles;
DROP POLICY IF EXISTS "View team members" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;


-- 3. Buat Policy Baru Menggunakan Fungsi Helper (Looping Terputus Disini)

-- A. Super Admin Boleh Segalanya
CREATE POLICY "Super Admin access all" 
ON public.profiles FOR ALL 
USING (
  public.get_my_role() = 'super_admin'
);

-- B. User Biasa Boleh Lihat Teman Satu Organisasi (Tenant)
CREATE POLICY "View team members" 
ON public.profiles FOR SELECT 
USING (
  organization_id = public.get_my_org_id()
  OR
  id = auth.uid() -- Selalu boleh lihat profil sendiri
);

-- C. User Boleh Edit Profil Sendiri
CREATE POLICY "Update own profile" 
ON public.profiles FOR UPDATE 
USING (
  id = auth.uid()
);

-- D. Insert (Biasanya dihandle trigger, tapi jaga-jaga)
CREATE POLICY "Insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (
  id = auth.uid()
);