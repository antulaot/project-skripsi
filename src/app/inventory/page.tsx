import { SupabaseInventoryRepository } from "@/infrastructure/supabase/repositories/SupabaseInventoryRepository";
import { deleteInventoryAction } from "./actions";
import Link from "next/link";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server"; // Import ini
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  // 1. Ambil Session User
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Proteksi Ganda (Middleware harusnya sudah handle, tapi ini jaga-jaga)
  if (!user) {
    redirect("/login");
  }

  const repo = new SupabaseInventoryRepository();
  
  // 3. Panggil findAll dengan ID User asli!
  // Bukan "00000..." lagi, tapi user.id
  const items = await repo.findAll(user.id);

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
           {/* Opsional: Tampilkan email user agar terlihat personal */}
           Gudang {user.email?.split('@')[0]}
        </h1>
        
        <Link 
          href="/inventory/add" 
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        >
          + Tambah Barang
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-gray-50 rounded border border-dashed">
            <p className="text-gray-500 mb-2">Gudangmu masih kosong.</p>
            <p className="text-sm text-gray-400">Data yang kamu tambah akan muncul di sini (Private).</p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Stok Saat Ini</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {item.stockLevel} <span className="text-base font-normal">{item.unit}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                 <Link 
                   href={`/inventory/edit/${item.id}`}
                   className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition flex items-center"
                 >
                   Edit
                 </Link>

                 <form action={deleteInventoryAction.bind(null, item.id)}>
                    <button 
                      type="submit" 
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                    >
                      Hapus
                    </button>
                 </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}