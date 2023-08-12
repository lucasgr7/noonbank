CREATE TABLE account_transactions (
    showClock BOOLEAN,
    displayDate VARCHAR(255),
    footer VARCHAR(255),
    title VARCHAR(255),
    id UUID PRIMARY KEY,
    strikethrough BOOLEAN,
    kind VARCHAR(255),
    postDate DATE,
    detail VARCHAR(255),
    amount DECIMAL(10, 2)
);
