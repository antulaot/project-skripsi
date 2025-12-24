'use server';

import { SupabaseInventoryRepository } from "@/infrastructure/supabase/repositories/SupabaseInventoryRepository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { InventoryCategory, InventoryItem, UnitType } from "@/core/entities/InventoryItem";
import { ConsoleLogger } from "@/infrastructure/logging/ConsoleLogger";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
// ---------------------------------------------------------
// ACTION: CREATE (Tambah Barang)
// ---------------------------------------------------------
export async function createInventoryAction(formData: FormData) {
  const logger = new ConsoleLogger();
  const repo = new SupabaseInventoryRepository();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  // Ekstrak Data
  const sku = formData.get("sku") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as InventoryCategory;
  const stockLevel = Number(formData.get("stockLevel"));
  const unit = formData.get("unit") as UnitType;
  const location = formData.get("location") as string;

  // Buat Entity Baru (Generate ID di sini)
  const newItem: InventoryItem = {
    id: crypto.randomUUID(),
    organizationId: user.id,
    sku: sku,
    name: name,
    category: category,
    stockLevel: stockLevel,
    minStockLevel: 0,
    unit: unit,
    location: location,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    logger.info(`Creating inventory item: ${newItem.sku}`);
    await repo.save(newItem); // Repo menggunakan Upsert, jadi aman
    logger.info(`Created inventory item: ${newItem.id}`);
    
    revalidatePath("/inventory");
  } catch (error) {
    logger.error('Error creating inventory item', error);
    throw error; // Wajib throw agar Next.js tahu action gagal
  }

  // Redirect sukses (di luar try/catch)
  redirect("/inventory");
}

// ---------------------------------------------------------
// ACTION: UPDATE (Edit Barang)
// ---------------------------------------------------------
export async function updateInventoryAction(formData: FormData) {
  const logger = new ConsoleLogger();
  const repo = new SupabaseInventoryRepository();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Ekstrak Data (termasuk ID dari hidden input)
  const id = formData.get("id") as string;
  const sku = formData.get("sku") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as InventoryCategory;
  const stockLevel = Number(formData.get("stockLevel"));
  const unit = formData.get("unit") as UnitType;
  const location = formData.get("location") as string;

  // Re-construct Entity
  const itemData: InventoryItem = {
    id: id,
    organizationId: user.id,
    sku: sku,
    name: name,
    category: category,
    stockLevel: stockLevel,
    minStockLevel: 0,
    unit: unit,
    location: location,
    // Note: createdAt sebaiknya tetap pakai tanggal lama, 
    // tapi karena repo kita sederhana (overwrite), new Date() tidak fatal untuk sekarang.
    createdAt: new Date(), 
    updatedAt: new Date(),
  };

  try {
    logger.info(`Updating inventory item: ${itemData.id}`);
    await repo.save(itemData);
    logger.info(`Updated inventory item: ${itemData.id}`);
    
    revalidatePath('/inventory');
  } catch (error) {
    logger.error('Error updating inventory item', error);
    throw error;
  }

  redirect('/inventory');
}

// ---------------------------------------------------------
// ACTION: DELETE (Hapus Barang)
// ---------------------------------------------------------
export async function deleteInventoryAction(id: string) {
  const logger = new ConsoleLogger();
  const repo = new SupabaseInventoryRepository();

  try {
    logger.info(`Deleting inventory item: ${id}`);
    await repo.delete(id);
    logger.info(`Deleted inventory item: ${id}`);

    revalidatePath('/inventory');
  } catch (error) {
    logger.error('Error deleting inventory item', error);
    throw error;
  }
}