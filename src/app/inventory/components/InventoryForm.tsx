// src/app/inventory/components/InventoryForm.tsx
"use client";

import { InventoryItem, InventoryCategory, UnitType } from "@/core/entities/InventoryItem";

type Props = {
  initialData?: InventoryItem; // Jika undefined = Mode CREATE. Jika ada = Mode EDIT.
  onSubmit: (formData: FormData) => Promise<void>; 
};

export function InventoryForm({ initialData, onSubmit }: Readonly<Props>) {
  // Daftar Opsi untuk Dropdown (Sesuai dengan Type di Entity)
  const categories: InventoryCategory[] = ['PUPUK', 'HERBISIDA', 'SPAREPART', 'BARANG UMUM'];
  const units: UnitType[] = ['KG', 'LITER', 'UNIT', 'BUAH'];

  return (
    <form action={onSubmit} className="space-y-4 bg-white p-6 rounded shadow-md border border-gray-100">
       
       {/* 1. Field ID (Hidden) - Wajib ada untuk proses Update */}
       {initialData?.id && (
         <input type="hidden" name="id" value={initialData.id} />
       )}

       {/* 2. SKU / Kode Barang */}
       <div>
         <label className="block text-sm font-medium text-gray-700">
           SKU / Kode Barang{' '}
           <input 
             name="sku" 
             type="text"
             required
             defaultValue={initialData?.sku}
             // Jika mode edit, SKU dikunci agar konsistensi data terjaga
             readOnly={!!initialData} 
             placeholder="Contoh: PUPUK-001"
             className={`mt-1 block w-full rounded-md border p-2 text-base ${
               initialData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'
             }`}
           />
         </label>
         {initialData && <p className="text-xs text-gray-500 mt-1">*SKU tidak dapat diubah</p>}
       </div>
       
       {/* 3. Nama Barang */}
       <div>
         <label className="block text-sm font-medium text-gray-700">
           Nama Barang{' '}
           <input 
             name="name" 
             type="text"
             required
             defaultValue={initialData?.name} 
             placeholder="Contoh: NPK Mutiara 16-16-16"
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 font-normal text-base" 
           />
         </label>
       </div>

       {/* 4. Kategori (Dropdown) */}
       <div>
         <label className="block text-sm font-medium text-gray-700">
           Kategori{' '}
           <select
             name="category"
             required
             defaultValue={initialData?.category || ""}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white text-base"
           >
             <option value="" disabled>-- Pilih Kategori --</option>
             {categories.map((cat) => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
           </select>
         </label>
       </div>

       {/* Grouping: Stok & Satuan sejajar agar hemat tempat */}
       <div className="grid grid-cols-2 gap-4">
         {/* 5. Stok Level */}
         <div>
           <label className="block text-sm font-medium text-gray-700">
             Jumlah Stok{' '}
             <input 
               name="stockLevel" 
               type="number"
               min="0"
               step="0.01" // Mengizinkan desimal (misal 1.5 Liter)
               required
               defaultValue={initialData?.stockLevel ?? 0} 
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 font-normal text-base" 
             />
           </label>
         </div>

         {/* 6. Satuan (Dropdown) */}
         <div>
           <label className="block text-sm font-medium text-gray-700">
             Satuan{' '}
             <select
               name="unit"
               required
               defaultValue={initialData?.unit || "KG"}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white text-base"
             >
               {units.map((u) => (
                 <option key={u} value={u}>{u}</option>
               ))}
             </select>
           </label>
         </div>
       </div>

       {/* 7. Lokasi Gudang (Optional) */}
       <div>
         <label className="block text-sm font-medium text-gray-700">
           Lokasi Penyimpanan <span className="text-gray-400 font-normal">(Opsional)</span>{' '}
           <input 
             name="location" 
             type="text"
             defaultValue={initialData?.location || ""} 
             placeholder="Contoh: Gudang A - Rak 3"
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 font-normal text-base" 
           />
         </label>
       </div>

       {/* Tombol Submit */}
       <button 
         type="submit"
         className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-medium shadow-sm"
       >
         {initialData ? "Simpan Perubahan" : "Tambah Barang Baru"}
       </button>
    </form>
  );
}