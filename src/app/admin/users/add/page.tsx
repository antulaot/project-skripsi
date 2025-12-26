import { createUserAction } from "../actions";

export default function AddUserPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Staff Baru</h1>
      
      {/* SOLUSI ERROR 2 (Type Error):
         Hapus 'return { success: true }' di actions.ts kamu
         dan pastikan pakai redirect() di sana.
      */}
      <form action={createUserAction} className="space-y-4 bg-white p-6 rounded shadow">
        
        {/* Input Email */}
        <div>
          <label 
            htmlFor="email"  // <--- Sambungkan ke ID input
            className="block text-sm font-medium mb-1"
          >
            Email
          </label>
          <input 
            id="email"       // <--- ID Unik (Deterministic)
            name="email" 
            type="email" 
            required 
            className="w-full border p-2 rounded"
            placeholder="staff@kebun.com"
          />
        </div>

        {/* Input Password */}
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium mb-1"
          >
            Password Awal
          </label>
          <input 
            id="password" 
            name="password" 
            type="text" 
            required 
            className="w-full border p-2 rounded"
            placeholder="Rahasia123"
          />
        </div>

        {/* Input Nama Lengkap */}
        <div>
          <label 
            htmlFor="fullName" 
            className="block text-sm font-medium mb-1"
          >
            Nama Lengkap
          </label>
          <input 
            id="fullName" 
            name="fullName" 
            type="text" 
            required 
            className="w-full border p-2 rounded"
            placeholder="Budi Santoso"
          />
        </div>

        {/* Select Role */}
        <div>
          <label 
            htmlFor="role" 
            className="block text-sm font-medium mb-1"
          >
            Role / Jabatan
          </label>
          <select 
            id="role" 
            name="role" 
            className="w-full border p-2 rounded"
          >
            <option value="staff">Staff Kebun</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          + Tambahkan User
        </button>

      </form>
    </div>
  );
}