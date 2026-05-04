ALTER TABLE wallet_categories
    DROP CONSTRAINT fk_wallet_categories_wallet,
    ADD CONSTRAINT fk_wallet_categories_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE;

ALTER TABLE transactions
    DROP CONSTRAINT fk_transactions_wallet,
    ADD CONSTRAINT fk_transactions_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE;

ALTER TABLE transactions
    DROP CONSTRAINT fk_transactions_dest_wallet,
    ADD CONSTRAINT fk_transactions_dest_wallet FOREIGN KEY (destination_wallet_id) REFERENCES wallets(id) ON DELETE SET NULL;

ALTER TABLE subscriptions
    DROP CONSTRAINT subscriptions_wallet_id_fkey,
    ADD CONSTRAINT subscriptions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE;
