ALTER TABLE wallets
    ADD CONSTRAINT uq_wallet_name_per_user UNIQUE (name, user_id);
