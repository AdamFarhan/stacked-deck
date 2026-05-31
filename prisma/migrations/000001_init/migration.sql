CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE "cards" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "clean_name" TEXT,
  "normalized_name" TEXT NOT NULL,
  "type" TEXT,
  "supertype" TEXT,
  "domains" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "energy" INTEGER,
  "might" INTEGER,
  "power" INTEGER,
  "rules_text_plain" TEXT,
  "rules_text_html" TEXT,
  "flavor_text" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "orientation" TEXT,
  "accessibility_text" TEXT,
  "search_text" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sets" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "card_count" INTEGER,
  "release_date" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "printings" (
  "id" TEXT NOT NULL,
  "card_id" TEXT NOT NULL,
  "set_id" TEXT,
  "provider" TEXT NOT NULL,
  "provider_card_id" TEXT NOT NULL,
  "riftbound_id" TEXT,
  "tcgplayer_id" TEXT,
  "collector_number" INTEGER,
  "rarity" TEXT,
  "image_url" TEXT,
  "image_width" INTEGER,
  "image_height" INTEGER,
  "image_source" TEXT,
  "image_alt_text" TEXT,
  "artist" TEXT,
  "alternate_art" BOOLEAN NOT NULL DEFAULT false,
  "overnumbered" BOOLEAN NOT NULL DEFAULT false,
  "signature" BOOLEAN NOT NULL DEFAULT false,
  "provider_updated_at" TIMESTAMP(3),
  "raw_source" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "printings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "import_runs" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finished_at" TIMESTAMP(3),
  "cards_seen" INTEGER NOT NULL DEFAULT 0,
  "cards_created" INTEGER NOT NULL DEFAULT 0,
  "cards_updated" INTEGER NOT NULL DEFAULT 0,
  "printings_created" INTEGER NOT NULL DEFAULT 0,
  "printings_updated" INTEGER NOT NULL DEFAULT 0,
  "error_message" TEXT,
  CONSTRAINT "import_runs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cards_slug_key" ON "cards"("slug");
CREATE INDEX "cards_normalized_name_idx" ON "cards"("normalized_name");
CREATE INDEX "cards_search_text_trgm_idx" ON "cards" USING GIN ("search_text" gin_trgm_ops);

CREATE UNIQUE INDEX "sets_code_key" ON "sets"("code");

CREATE UNIQUE INDEX "printings_riftbound_id_key" ON "printings"("riftbound_id");
CREATE UNIQUE INDEX "printings_provider_provider_card_id_key" ON "printings"("provider", "provider_card_id");
CREATE INDEX "printings_set_id_idx" ON "printings"("set_id");
CREATE INDEX "printings_collector_number_idx" ON "printings"("collector_number");

CREATE INDEX "import_runs_provider_started_at_idx" ON "import_runs"("provider", "started_at");

ALTER TABLE "printings" ADD CONSTRAINT "printings_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "printings" ADD CONSTRAINT "printings_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
