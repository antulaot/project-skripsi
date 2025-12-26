-- 1. Buat tipe data ENUM untuk Role (biar konsisten)
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'kepala gudang', 'staff', 'manager');

-- 2. Buat tabel profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role user_role DEFAULT 'staff',
  organization_id UUID, -- INI KUNCI ISOLASI DATA PER TENANT
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Nyalakan Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Super Admin boleh melihat & edit SEMUA profil
CREATE POLICY "Super Admin access all" 
  ON public.profiles FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- 5. Policy: User biasa cuma boleh lihat profil teman setim (Satu Tenant)
CREATE POLICY "View team members" 
  ON public.profiles FOR SELECT 
  USING (
    organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- 6. Trigger Otomatis: Saat user dibuat, buat baris kosong di profiles
-- Nanti datanya akan di-update oleh Server Action
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'staff');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();