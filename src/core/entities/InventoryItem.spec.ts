import { describe, it, expect } from "vitest";
import { createInventoryItem } from "./InventoryItem";

describe('InventoryItem Entity', () => {
    it('should create a valid inventory item', () => {
        const item = createInventoryItem({
            id: '123',
            organizationId: 'PT-123',
            sku: 'KODE-123',
            name: 'Pupuk NPK',
            category: 'PUPUK',
            stockLevel: 100,
            minStockLevel: 10,
            unit: 'KG',
            location: 'SEKADAU',
        });

        expect(item.name).toBe('Pupuk NPK');
        expect(item.stockLevel).toBe(100);
    })

    it('should not create an inventory item with invalid stock level', () => {
        expect(() => {
            createInventoryItem({
                id: '123',
                organizationId: 'PT-123',
                sku: 'KODE-123',
                name: 'PUPUK NPK',
                category: 'PUPUK',
                stockLevel: -50,
                minStockLevel: 1,
                unit: 'KG',
                location: 'SEKADAU',
            });
        }).toThrow('Stock level cannot be negative');
    })
    // Tambahkan di dalam describe
it('should throw error if SKU is empty', () => {
    expect(() => {
        createInventoryItem({
            id: '123',
            organizationId: 'PT-123',
            sku: '', // <--- SENGAJA KOSONG
            name: 'Pupuk',
            category: 'PUPUK',
            stockLevel: 10,
            minStockLevel: 5,
            unit: 'KG',
        });
    }).toThrow('SKU cannot be empty');
});
})