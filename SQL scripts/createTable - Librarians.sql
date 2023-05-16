DROP TABLE IF EXISTS "Librarians";

CREATE TABLE "Librarians" (
    "librarianID" SERIAL PRIMARY KEY,
    "librarianFirstName" varchar(255),
    "librarianLastName" varchar(255),
    "librarianEmail" varchar(255),
    "librarianPhone" varchar(255),
    "librarianBirthDate" DATE,
    "librarianPassword" varchar(255)
)