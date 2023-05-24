DROP View IF EXISTS "allLoans";
Create View "allLoans" AS
SELECT "loanID" AS "Loan ID", b."bookTitle" AS "Book title", b."bookISBN" AS "ISBN",
	   concat(a."authorFirstName", ' ', a."authorLastName") AS "Author",
	   p."publisherName" AS "Publisher",
	   l."loanLoanDate" AS "Loan date", l."loanDueDate" AS "Due date", 
	   l."loanReturnDate" AS "Return date",
	   "loanStatus" AS "Status",
	   r."readerEmail" as "User",
	   "loanRenewals" AS "Renewals",
	   "loanOverdue" AS "Overdue",
	   "loanFine" AS "Fine",
	   "currencyCode" AS "Currency",
	   "loanBookID" AS "Book ID",
	   "loanReaderID" AS "eader ID",
	   "currencyID" AS "Currency ID"
FROM "Books" b
JOIN "Loans" l ON b."bookID"=l."loanBookID"
JOIN "Readers" r ON l."loanReaderID" = r."readerID"
JOIN "Authors" a ON b."bookAuthorID" = a."authorID"
JOIN "Publishers" p ON b."bookPublisherID" = p."publisherID"
JOIN "Currencies" c ON c."currencyID" = l."loanCurrencyID";

CREATE OR REPLACE VIEW "allUsers" AS
SELECT
    "id",
    "username",
    "role",
    "password",
    "teamID" AS "Team ID"
  FROM (
    SELECT
      "readerID" AS id,
      "readerEmail" AS username,
      'Reader' AS role,
      "readerPassword" AS password,
      NULL AS "teamID"
    FROM
      "Readers"
    UNION
    SELECT
      "librarianID" AS id,
      "librarianEmail" AS username,
      CASE
        WHEN "librarianID" IN (SELECT "managerLibrarianID" FROM "Managers") THEN 'Manager'
        WHEN "librarianID" IN (SELECT "employeeLibrarianID" FROM "Employees") THEN 'Employee'
        ELSE 'Librarian'
      END AS role,
      "librarianPassword" AS password,
      CASE
        WHEN "librarianID" IN (SELECT "managerLibrarianID" FROM "Managers") THEN (
          SELECT "managerTeamID" FROM "Managers" WHERE "managerLibrarianID" = "Librarians"."librarianID"
        )
        WHEN "librarianID" IN (SELECT "employeeLibrarianID" FROM "Employees") THEN (
          SELECT "employeeTeamID" FROM "Employees" WHERE "employeeLibrarianID" = "Librarians"."librarianID"
        )
        ELSE NULL
      END AS "teamID"
    FROM
      "Librarians"
    ) AS users
  ORDER BY
    id;

CREATE OR REPLACE VIEW "enrichedLibraryOrders" AS
SELECT "libraryOrderID" as "Library Order ID",
      "libraryOrderBookTitle" AS "Book title",
      "libraryOrderISBN" AS "ISBN",
      concat(a."authorFirstName",a."authorLastName")  as "Author",
      "libraryOrderAmount" AS "Order amount",
      "libraryOrderCost" as "Cost",
      c."currencyName" AS "Currency",
      "libraryOrderDateOrdered" AS "Order date",
      "libraryOrderDeliveryDate" AS "Delivery Date",
      "libraryOrderStatusOrder" AS "Order status",
      concat(l."librarianFirstName", ' ', l."librarianLastName") AS "Manager",
      "authorID" AS "Author ID",
      "currencyID" AS "Currency ID",
      "libraryOrderManagerLibrarianID" AS "Librarian ID",
      "libraryOrderPublisherID" AS "Publisher ID"
      
      
  FROM "LibraryOrders" lo
  JOIN "Authors" a ON lo."libraryOrderAuthorID" = a."authorID"
  JOIN "Currencies" c ON lo."libraryOrderCurrencyID" = c."currencyID"
  JOIN "Librarians" l ON lo."libraryOrderManagerLibrarianID" = l."librarianID";

CREATE OR REPLACE VIEW "enrichedPublishers" AS
SELECT 
      "publisherID" AS "Publisher ID",
      "publisherName" AS "Name",
      z."zipCode" AS "Zip",
      z."zipCity" AS "City",
        "publisherStreetName" AS "Street",
      "publisherHouseNumber" AS "Housenumber",
      "publisherCountry" AS "Country",
      "publisherEmail" AS "Email",
      "publisherPhone" AS "Phone"
    FROM "Publishers" p
    JOIN "ZIPs" z ON p."publisherZipID" = z."zipID";

CREATE OR REPLACE VIEW "enrichedLibrarians" AS
SELECT "librarianID" AS "ID", 
      "librarianFirstName" AS "Firstname", 
      "librarianLastName" AS "Lastname", 
      "librarianEmail" AS "Email", 
      "librarianPhone" AS "Phone", 
      "librarianBirthDate" AS "Birth date",
        "teamID" AS "Team ID",
        
        CASE
            WHEN "librarianID" IN (SELECT "managerLibrarianID" FROM "Managers") THEN 'Manager'
            WHEN "librarianID" IN (SELECT "employeeLibrarianID" FROM "Employees") THEN 'Employee'
            ELSE 'Librarian'
        END AS "Role"
        
    
    FROM "Librarians" l
    LEFT JOIN "Employees" e ON e."employeeLibrarianID" = l."librarianID"
    LEFT JOIN "Managers" m ON m."managerLibrarianID" = l."librarianID"
    LEFT JOIN "Teams" t ON "teamID" = e."employeeTeamID" OR "teamID" = m."managerTeamID";

CREATE OR REPLACE VIEW "enrichedTeams" AS
SELECT 
      "librarianID" AS "ID", 
      "librarianFirstName" AS "Firstname", 
      "librarianLastName" AS "Lastname", 
      "librarianEmail" AS "Email", 
      "librarianPhone" AS "Phone", 
      "librarianBirthDate" AS "Birth date",
      "employeeTeamID" AS "Team ID"
    FROM 
      "Teams" t
    JOIN "Employees" e ON e."employeeTeamID" = t."teamID"
    JOIN "Librarians" l ON "employeeLibrarianID" = l."librarianID";
	