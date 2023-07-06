DROP TABLE IF EXISTS "Books" CASCADE;

CREATE TABLE
    "Books" (
        "bookID" SERIAL PRIMARY KEY,
        "bookAmount" INTEGER,
        "bookTitle" varchar(255),
        "bookAuthorID" INTEGER,
        "bookISBN" varchar(255) UNIQUE,
        "bookPublisherID" INTEGER,
        "bookPublicationDate" DATE,
        "bookAvailability" BOOLEAN,
        "bookAvailableAmount" INTEGER,
        "bookCategoryID" INTEGER,
        CONSTRAINT fk_bookAuthorID FOREIGN KEY ("bookAuthorID") REFERENCES "Authors" ("authorID") ON DELETE CASCADE,
        CONSTRAINT fk_bookPublisherID FOREIGN KEY ("bookPublisherID") REFERENCES "Publishers" ("publisherID") ON DELETE CASCADE,
        CONSTRAINT fk_bookCategoryID FOREIGN KEY ("bookCategoryID") REFERENCES "Categories" ("categoryID") ON DELETE CASCADE
    );