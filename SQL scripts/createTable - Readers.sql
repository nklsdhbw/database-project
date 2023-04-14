DROP TABLE IF EXISTS "Readers";

CREATE TABLE "Readers" (
"readerID" SERIAL PRIMARY KEY,
    "readerName" varchar(255),
    "readerEmail" varchar(255),
    "readerPassword" varchar(255)
    
)
