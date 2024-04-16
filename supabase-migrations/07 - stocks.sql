CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(255) NOT NULL,
    quantity NUMERIC NOT NULL CHECK (quantity >= 0),
    investment_type VARCHAR(50) CHECK (
        investment_type IN ('brazilian_stock', 'us_stock', 'brazilian_treasury_bond', 'liquid_investment')
    )
);
