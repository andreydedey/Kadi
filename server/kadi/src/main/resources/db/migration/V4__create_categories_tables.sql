CREATE TABLE categories (
    id      BIGSERIAL    PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    user_id UUID,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE wallet_categories (
    wallet_id       UUID   NOT NULL,
    category_id     BIGINT NOT NULL,
    spending_limit  INTEGER,
    PRIMARY KEY (wallet_id, category_id),
    CONSTRAINT fk_wallet_categories_wallet   FOREIGN KEY (wallet_id)   REFERENCES wallets (id),
    CONSTRAINT fk_wallet_categories_category FOREIGN KEY (category_id) REFERENCES categories (id)
);
