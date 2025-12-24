import { InventoryForm } from "../components/InventoryForm";
import { createInventoryAction } from "../actions";

export default function AddInventoryPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Barang Baru</h1>
      
      {/* REUSABLE COMPONENT:
        Kita pakai form yang sama, tapi tanpa 'initialData' (karena ini baru).
        Action yang dikirim adalah 'createInventoryAction'.
      */}
      <InventoryForm onSubmit={createInventoryAction} />
    </div>
  );
}