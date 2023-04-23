DROP TABLE IF EXISTS "Books";

CREATE TABLE "Books" (
    "bookID" SERIAL PRIMARY KEY,
	"bookAmount" INTEGER,
    "bookTitle" varchar(255),
    "bookAuthorID" INTEGER,
    "bookISBN" varchar(255) UNIQUE,
    "bookPublisherID" INTEGER,
    "bookPublicationDate" DATE,
    "bookPublicationPlace" varchar(255),
    "bookAvailability" BOOLEAN,
    "bookAvailableAmount" INTEGER,
    "bookCategoryID" INTEGER,
	CONSTRAINT fk_authorID
      FOREIGN KEY("bookAuthorID") 
	  REFERENCES "Authors"("authorID")
	  ON DELETE CASCADE,

      CONSTRAINT fk_publisherID
      FOREIGN KEY("bookPublisherID") 
	  REFERENCES "Publishers"("publisherID")
	  ON DELETE CASCADE,

      CONSTRAINT fk_categoryID
      FOREIGN KEY("bookCategoryID") 
	  REFERENCES "Categories"("categoryID")
	  ON DELETE CASCADE
)
