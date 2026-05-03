CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL,
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    category_id BIGINT REFERENCES categories(id)
);
