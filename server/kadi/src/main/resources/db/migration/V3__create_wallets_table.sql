CREATE TABLE wallets (
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name     VARCHAR(255) NOT NULL,
    currency VARCHAR(10)  NOT NULL,
    balance  INTEGER      NOT NULL DEFAULT 0,
    user_id  UUID         NOT NULL,
    CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES users (id)
);
