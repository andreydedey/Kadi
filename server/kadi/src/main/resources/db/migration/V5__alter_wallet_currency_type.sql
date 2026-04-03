UPDATE wallets SET currency = UPPER(currency);

ALTER TABLE wallets
    ALTER COLUMN currency TYPE VARCHAR(10),
    ADD CONSTRAINT chk_wallet_currency CHECK (currency IN ('USD', 'EUR', 'BRL', 'GBP', 'JPY', 'BTC', 'ETH'));
