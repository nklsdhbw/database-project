DROP TABLE IF EXISTS "Librarians";

CREATE TABLE "Librarians" (
    "librarianID" SERIAL PRIMARY KEY,
    "librarianName" varchar(255),
    "librarianEmail" varchar(255),
    "librarianPhone" varchar(255)
)