import { SupabaseInventoryRepository } from "@/infrastructure/supabase/repositories/SupabaseInventoryRepository";
import { InventoryForm } from "../../components/InventoryForm";
import { updateInventoryAction } from "../../actions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>; // Next.js 15: params adalah Promise
}

export default async function EditInventoryPage({ params }: PageProps) {
  // 1. Ambil ID dari URL (Wajib di-await di Next.js 15)
  const { id } = await params;

  // 2. Fetch Data Lama dari Database
  // Ingat: Kita boleh panggil Repository langsung di Server Component (Aman & Cepat)
  const repo = new SupabaseInventoryRepository();
  const item = await repo.findById(id);

  // 3. Validasi: Jika barang tidak ketemu (misal ID ngawur), tampilkan 404
  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Barang</h1>
      
      {/* REUSABLE COMPONENT:
        Di sini kita isi props 'initialData' dengan data dari database.
        Action yang dikirim adalah 'updateInventoryAction'.
      */}
      <InventoryForm 
        initialData={item} 
        onSubmit={updateInventoryAction} 
      />
    </div>
  );
}