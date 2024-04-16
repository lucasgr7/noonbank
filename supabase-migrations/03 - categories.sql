CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color_font VARCHAR(7) CHECK (color_font ~ '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'),
    background_color VARCHAR(7) CHECK (background_color ~ '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
);

-- Adding category_id to the transactions table
ALTER TABLE transactions
ADD COLUMN category_id INTEGER,
ADD CONSTRAINT fk_category_id
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE SET NULL;

-- Adding category_id to the account_transactions table
ALTER TABLE account_transactions
ADD COLUMN category_id INTEGER,
ADD CONSTRAINT fk_account_category_id
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE SET NULL;
