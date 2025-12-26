import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

// Definisi Tipe Data Profil
interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'staff';
  organization_id: string;
  created_at: string;
}

export default async function UserListPage() {
  // 1. Inisialisasi Supabase Client
  const supabase = await createSupabaseServerClient();
  
  // 2. Cek Login (Security Basic)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 3. Ambil Data Users (Profiles)
  // RLS di Database akan otomatis memfilter data sesuai hak akses user yang login
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Error mengambil data: {error.message}</div>;
  }

  // Helper untuk warna badge role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staff': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header & Tombol Tambah */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500">Daftar semua pengguna yang terhubung dengan organisasi Anda.</p>
        </div>
        
        <Link 
          href="/admin/users/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          + Tambah User Baru
        </Link>
      </div>

      {/* Tabel Data */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bergabung</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Belum ada user lain selain Anda.
                </td>
              </tr>
            ) : (
              users?.map((profile: any) => (
                <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                  {/* Kolom Nama & Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                        {/* Avatar Sederhana (Inisial) */}
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {profile.full_name || 'Tanpa Nama'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {profile.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Kolom Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(profile.role)}`}>
                      {profile.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  {/* Kolom Organization ID (Untuk Debugging Isolasi Data) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {profile.organization_id?.slice(0, 8)}...
                  </td>

                  {/* Kolom Tanggal */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(profile.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}