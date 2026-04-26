CREATE TABLE transactions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id             UUID        NOT NULL,
    type                  VARCHAR(10) NOT NULL,
    amount                BIGINT      NOT NULL,
    category_id           BIGINT,
    destination_wallet_id UUID,
    destination_amount    BIGINT,
    description           VARCHAR(255),
    event_date            DATE        NOT NULL,
    CONSTRAINT fk_transactions_wallet      FOREIGN KEY (wallet_id)             REFERENCES wallets (id),
    CONSTRAINT fk_transactions_category    FOREIGN KEY (category_id)           REFERENCES categories (id),
    CONSTRAINT fk_transactions_dest_wallet FOREIGN KEY (destination_wallet_id) REFERENCES wallets (id)
);
