DROP TABLE IF EXISTS "ZIPs" CASCADE;

CREATE TABLE
    "ZIPs" (
        "zipID" SERIAL PRIMARY KEY,
        "zipCode" INTEGER,
        "zipCity" varchar(255)
    );