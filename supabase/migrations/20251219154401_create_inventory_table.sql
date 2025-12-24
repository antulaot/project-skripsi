-- ENUM
CREATE TYPE inventory_category as ENUM ('PUPUK', 'HERBISIDA', 'SPAREPART', 'BARANG UMUM');
CREATE TYPE unit_type AS ENUM ('KG', 'LITER', 'UNIT', 'BUAH');

--TABLE UTAMA
CREATE Table inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL ,
    sku VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category inventory_category NOT NULL,
    stock_level NUMERIC (10, 2) NOT NULL DEFAULT 0 CHECK (stock_level >= 0),
    min_stock_level NUMERIC (10, 2) NOT NULL DEFAULT 0,
    unit unit_type NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEX
CREATE INDEX idx_inventory_organization ON inventory_items (organization_id);
CREATE UNIQUE INDEX idx_inventory_sku_per_organization ON inventory_items (organization_id, sku);

--KEAMANAN SUPABASE (RLS)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- POLICY
CREATE POLICY "Enable all acces for dev" ON inventory_items
FOR ALL
USING (true)
WITH CHECK (true);
