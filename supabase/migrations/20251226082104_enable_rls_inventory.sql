DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_items' AND column_name = 'organization_id') THEN
        ALTER TABLE inventory_items ADD COLUMN organization_id UUID REFERENCES auth.users(id);
    END IF;
END$$;

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- POLICY UNTUK USER BERDASARKAN USER_ID

CREATE POLICY "user lihat data sendiri"
ON inventory_items
FOR SELECT
USING (auth.uid() = organization_id);

-- untuk insert

CREATE POLICY "user dapat menambah data sendiri"
ON inventory_items
FOR INSERT
WITH CHECK (auth.uid() = organization_id);

-- untuk update

CREATE POLICY "user dapat mengupdate data sendiri"
ON inventory_items
FOR UPDATE
USING (auth.uid() = organization_id);

-- untuk delete

CREATE POLICY "user dapat menghapus data sendiri"
ON inventory_items
FOR DELETE
USING (auth.uid() = organization_id);