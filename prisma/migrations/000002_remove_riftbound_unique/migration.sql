DROP INDEX IF EXISTS "printings_riftbound_id_key";
CREATE INDEX IF NOT EXISTS "printings_riftbound_id_idx" ON "printings"("riftbound_id");
