DROP VIEW IF EXISTS "enrichedBooks" CASCADE;

CREATE VIEW
   "enrichedBooks" AS
SELECT
   "bookID" AS "ID",
   "bookTitle" AS "Title",
   "bookISBN" AS "ISBN",
   "authorFirstName" AS "Author firstname",
   "authorLastName" AS "Author lastname",
   "publisherName" AS "Publisher",
   "categoryName" AS "Category",
   "bookPublicationDate" AS "Publication date",
   "bookAmount" AS "Amount (total)",
   "bookAvailableAmount" AS "Amount (available)",
   "bookAvailability" AS "Availability"
FROM
   "Books" b
   JOIN "Authors" a ON a."authorID" = b."bookAuthorID"
   JOIN "Categories" c ON c."categoryID" = b."bookCategoryID"
   JOIN "Publishers" p ON p."publisherID" = b."bookPublisherID"
ORDER BY
   "bookID";