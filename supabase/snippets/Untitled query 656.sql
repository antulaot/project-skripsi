-- 1. Update Role jadi super_admin
UPDATE public.profiles 
SET role = 'super_admin', 
    organization_id = id -- Super Admin jadi pemilik tenant pertama (dirinya sendiri)
WHERE email = 'user@dev.com'; -- GANTI DENGAN EMAILMU

-- Cek hasilnya
SELECT * FROM public.profiles;