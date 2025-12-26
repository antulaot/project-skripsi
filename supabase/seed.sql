-- 1. Siapkan Ekstensi Enkripsi
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Bersihkan data user lama (HATI-HATI: Ini menghapus semua user saat reset)
TRUNCATE auth.users CASCADE; 

-----------------------------------------------------------
-- USER 1: SUPER ADMIN
-----------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- ID Admin
  'authenticated', 'authenticated',
  'admin@skripsi.com', 
  crypt('password123', gen_salt('bf')), 
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}', 
  '{"full_name":"Super Admin Ganteng"}',
  now(), now(), '', '', '', ''
);

-- Identity Admin (FIX: Ditambahkan provider_id)
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"admin@skripsi.com"}',
  'email',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- <--- INI PERBAIKANNYA (Provider ID = User ID)
  now(), now(), now()
);

-- Update Profile Admin
UPDATE public.profiles
SET role = 'super_admin', organization_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';


-----------------------------------------------------------
-- USER 2: BUDI (STAFF)
-----------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', -- ID Budi
  'authenticated', 'authenticated',
  'budi@skripsi.com', 
  crypt('password123', gen_salt('bf')), 
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Budi Staff"}',
  now(), now(), '', '', '', ''
);

-- Identity Budi (FIX: Ditambahkan provider_id)
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
  '{"sub":"b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22","email":"budi@skripsi.com"}',
  'email',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', -- <--- INI PERBAIKANNYA (Provider ID = User ID)
  now(), now(), now()
);

-- Update Profile Budi
UPDATE public.profiles
SET role = 'staff', organization_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
WHERE id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22';