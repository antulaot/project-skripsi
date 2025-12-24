import { InventoryItem } from "../entities/InventoryItem";

export interface InventoryRepository {
    save(item: InventoryItem): Promise<void>;

    findById(id:string ): Promise<InventoryItem | null>;

    findAll( organizationId: string): Promise<InventoryItem[]>;
    
    delete(id: string): Promise<void>;
}