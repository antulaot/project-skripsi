export type InventoryCategory = 'PUPUK' | 'HERBISIDA' | 'SPAREPART' | 'BARANG UMUM';
export type UnitType = 'KG' | 'LITER' | 'UNIT' | 'BUAH';


export interface InventoryItem {
    id : string;
    organizationId: string;
    sku : string;
    name : string;
    category : InventoryCategory;
    stockLevel: number;
    minStockLevel: number;
    unit: UnitType;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

type CreateItemprops = Omit<InventoryItem, 'createdAt' | 'updatedAt'>;

export function createInventoryItem(props: CreateItemprops): InventoryItem {

    if (!props.sku || props.sku.trim() === '') {
        throw new Error('SKU cannot be empty');
    }

    if (props.stockLevel < 0) {
        throw new Error('Stock level cannot be negative');
    }
    return {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}