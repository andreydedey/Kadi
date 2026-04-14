ALTER TABLE wallet_categories
    ALTER COLUMN spending_limit TYPE BIGINT,
    ADD COLUMN spent BIGINT NOT NULL DEFAULT 0;
