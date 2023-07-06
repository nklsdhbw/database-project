DROP VIEW IF EXISTS "enrichedLibraryOrders" CASCADE;

CREATE VIEW
    "enrichedLibraryOrders" AS
SELECT
    "libraryOrderID" as "Library Order ID",
    "libraryOrderBookTitle" AS "Book title",
    "libraryOrderISBN" AS "ISBN",
    concat (a."authorFirstName", a."authorLastName") as "Author",
    "libraryOrderAmount" AS "Order amount",
    "libraryOrderCost" as "Cost",
    c."currencyName" AS "Currency",
    "libraryOrderDateOrdered" AS "Order date",
    "libraryOrderDeliveryDate" AS "Delivery Date",
    "libraryOrderStatusOrder" AS "Order status",
    concat (
        l."librarianFirstName",
        ' ',
        l."librarianLastName"
    ) AS "Manager",
    "authorID" AS "Author ID",
    "currencyID" AS "Currency ID",
    "libraryOrderManagerLibrarianID" AS "Librarian ID",
    "libraryOrderPublisherID" AS "Publisher ID"
FROM
    "LibraryOrders" lo
    JOIN "Authors" a ON lo."libraryOrderAuthorID" = a."authorID"
    JOIN "Currencies" c ON lo."libraryOrderCurrencyID" = c."currencyID"
    JOIN "Librarians" l ON lo."libraryOrderManagerLibrarianID" = l."librarianID"
ORDER BY
    "libraryOrderID";