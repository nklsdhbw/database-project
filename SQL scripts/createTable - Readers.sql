DROP TABLE IF EXISTS "Readers";

CREATE TABLE
    "Readers" (
        "readerID" SERIAL PRIMARY KEY,
        "readerFirstName" varchar(255),
        "readerLastName" varchar(255),
        "readerEmail" varchar(255),
        "readerPassword" varchar(255)
    )