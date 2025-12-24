import { InventoryRepository } from "@/core/repositories/InventoryRepository";
import { InventoryItem } from "@/core/entities/InventoryItem";
import { supabase } from "@/infrastructure/supabase/client";

export class SupabaseInventoryRepository implements InventoryRepository {
  
  // 1. Implementasi SAVE
  async save(item: InventoryItem): Promise<void> {
    // Mapping: Entity (camelCase) -> DB (snake_case)
    const persistenceModel = {
      id: item.id,
      organization_id: item.organizationId, // Perubahan nama field
      sku: item.sku,
      name: item.name,
      category: item.category,
      stock_level: item.stockLevel,         // Perubahan nama field
      min_stock_level: item.minStockLevel,  // Perubahan nama field
      unit: item.unit,
      location: item.location,
      updated_at: new Date().toISOString(), // Selalu update timestamp
    };

    // Upsert: Jika ID belum ada -> Insert. Jika ada -> Update.
    const { error } = await supabase
      .from("inventory_items")
      .upsert(persistenceModel);

    if (error) {
      // Kita lempar error generik agar UI tidak perlu tahu ini error SQL/Supabase
      throw new Error(`Failed to save inventory: ${error.message}`);
    }
  }

  // 2. Implementasi FIND BY ID
  async findById(id: string): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    // Mapping Balik: DB (snake_case) -> Entity (camelCase)
    return this.mapToEntity(data);
  }

  // 3. Implementasi FIND ALL
  async findAll(organizationId: string): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("organization_id", organizationId); // Filter Multi-tenant

    if (error) throw new Error(error.message);

    return (data || []).map((row) => this.mapToEntity(row));
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(`Failed to delete inventory: ${error.message}`);
    }
  }

  // PRIVATE HELPER: Mapper function
  // Tugasnya mengubah Data Mentah DB menjadi Entity yang bersih
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToEntity(row: any): InventoryItem {
    return {
      id: row.id,
      organizationId: row.organization_id,
      sku: row.sku,
      name: row.name,
      category: row.category,
      stockLevel: row.stock_level,
      minStockLevel: row.min_stock_level,
      unit: row.unit,
      location: row.location,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}