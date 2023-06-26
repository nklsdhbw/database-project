DROP TABLE IF EXISTS "Categories" CASCADE;

CREATE TABLE
    "Categories" (
        "categoryID" SERIAL PRIMARY KEY,
        "categoryName" varchar(255),
        "categoryDescription" varchar(255)
    );