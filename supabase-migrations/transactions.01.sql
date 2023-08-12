CREATE TABLE transactions (
    details_status VARCHAR(255),
    description VARCHAR(255),
    amount INTEGER,
    amount_without_iof INTEGER,
    details_fx_exchange_rate DECIMAL(10, 5),
    title VARCHAR(255),
    details_fx_precise_amount_usd DECIMAL(10, 5),
    id UUID PRIMARY KEY,
    account UUID,
    category VARCHAR(255),
    details_subcategory VARCHAR(255),
    details_fx_currency_origin VARCHAR(255),
    time TIMESTAMP,
    details_charges_amount DECIMAL(10, 5),
    details_fx_amount_usd BOOLEAN
);
ALTER TABLE transactions
ADD CONSTRAINT unique_transaction_id UNIQUE (id);
DELETE FROM transactions
WHERE id NOT IN (
    SELECT MIN(id)
    FROM transactions
    GROUP BY id
    HAVING COUNT(*) > 1
);
