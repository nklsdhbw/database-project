DROP TABLE IF EXISTS "Currencies";

CREATE TABLE
    "Currencies" (
        "currencyID" SERIAL PRIMARY KEY,
        "currencyName" varchar(255),
        "currencyCode" varchar(255)
    )