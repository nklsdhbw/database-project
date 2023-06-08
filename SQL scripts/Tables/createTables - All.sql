DROP TABLE IF EXISTS "Authors" CASCADE;

CREATE TABLE
    "Authors" (
        "authorID" SERIAL PRIMARY KEY,
        "authorFirstName" varchar(255),
        "authorLastName" varchar(255),
        "authorEmail" varchar(255),
        "authorPhone" varchar(255)
    );

DROP TABLE IF EXISTS "Readers" CASCADE;

CREATE TABLE
    "Readers" (
        "readerID" SERIAL PRIMARY KEY,
        "readerFirstName" varchar(255),
        "readerLastName" varchar(255),
        "readerEmail" varchar(255),
        "readerPassword" varchar(255)
    );

DROP TABLE IF EXISTS "ZIPs" CASCADE;

CREATE TABLE
    "ZIPs" (
        "zipID" SERIAL PRIMARY KEY,
        "zipCode" INTEGER,
        "zipCity" varchar(255)
    );

DROP TABLE IF EXISTS "Categories" CASCADE;

CREATE TABLE
    "Categories" (
        "categoryID" SERIAL PRIMARY KEY,
        "categoryName" varchar(255),
        "categoryDescription" varchar(255)
    );

DROP TABLE IF EXISTS "Currencies" CASCADE;

CREATE TABLE
    "Currencies" (
        "currencyID" SERIAL PRIMARY KEY,
        "currencyName" varchar(255),
        "currencyCode" varchar(255)
    );

DROP TABLE IF EXISTS "Librarians" CASCADE;

CREATE TABLE
    "Librarians" (
        "librarianID" SERIAL PRIMARY KEY,
        "librarianFirstName" varchar(255),
        "librarianLastName" varchar(255),
        "librarianEmail" varchar(255),
        "librarianPhone" varchar(255),
        "librarianBirthDate" DATE,
        "librarianPassword" varchar(255)
    );

DROP TABLE IF EXISTS "Publishers" CASCADE;

CREATE TABLE
    "Publishers" (
        "publisherID" SERIAL PRIMARY KEY,
        "publisherName" varchar(255),
        "publisherZipID" INTEGER,
        "publisherStreetName" varchar(255),
        "publisherHouseNumber" varchar(255),
        "publisherCountry" varchar(255),
        "publisherEmail" varchar(255),
        "publisherPhone" varchar(255),
        CONSTRAINT fk_publisherCurrencyCode FOREIGN KEY ("publisherZipID") REFERENCES "ZIPs" ("zipID") ON DELETE CASCADE
    );

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
        CONSTRAINT fk_authorID FOREIGN KEY ("bookAuthorID") REFERENCES "Authors" ("authorID") ON DELETE CASCADE,
        CONSTRAINT fk_publisherID FOREIGN KEY ("bookPublisherID") REFERENCES "Publishers" ("publisherID") ON DELETE CASCADE,
        CONSTRAINT fk_categoryID FOREIGN KEY ("bookCategoryID") REFERENCES "Categories" ("categoryID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "Teams" CASCADE;

CREATE TABLE
    "Teams" ("teamID" SERIAL PRIMARY KEY);

DROP TABLE IF EXISTS "Loans" CASCADE;

CREATE TABLE
    "Loans" (
        "loanID" SERIAL PRIMARY KEY,
        "loanBookID" INTEGER,
        "loanReaderID" INTEGER,
        "loanLoanDate" DATE,
        "loanDueDate" DATE,
        "loanReturnDate" DATE,
        "loanStatus" varchar(255),
        "loanRenewals" INTEGER,
        "loanOverdue" BOOLEAN,
        "loanFine" DECIMAL,
        "loanCurrencyID" INTEGER,
        CONSTRAINT fk_loanBookID FOREIGN KEY ("loanBookID") REFERENCES "Books" ("bookID") ON DELETE CASCADE,
        CONSTRAINT fk_loanReaderID FOREIGN KEY ("loanReaderID") REFERENCES "Readers" ("readerID") ON DELETE CASCADE,
        CONSTRAINT fk_loanCurrencyID FOREIGN KEY ("loanCurrencyID") REFERENCES "Currencies" ("currencyID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "Managers" CASCADE;

CREATE TABLE
    "Managers" (
        "managerID" SERIAL PRIMARY KEY,
        "managerLibrarianID" INTEGER UNIQUE,
        "managerTeamID" INTEGER,
        UNIQUE ("managerLibrarianID", "managerTeamID"),
        CONSTRAINT fk_managerLibrarianID FOREIGN KEY ("managerLibrarianID") REFERENCES "Librarians" ("librarianID") ON DELETE CASCADE,
        CONSTRAINT fk_managerTeamID FOREIGN KEY ("managerTeamID") REFERENCES "Teams" ("teamID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "LibraryOrders" CASCADE;

CREATE TABLE
    "LibraryOrders" (
        "libraryOrderID" SERIAL PRIMARY KEY,
        "libraryOrderCost" DECIMAL,
        "libraryOrderDeliveryDate" DATE,
        "libraryOrderAmount" INTEGER,
        "libraryOrderDateOrdered" DATE,
        "libraryOrderPublisherID" INTEGER,
        "libraryOrderBookTitle" varchar(255),
        "libraryOrderISBN" varchar(255),
        "libraryOrderAuthorID" INTEGER,
        "libraryOrderStatusOrder" varchar(255) DEFAULT 'order',
        "libraryOrderManagerLibrarianID" INTEGER,
        "libraryOrderCurrencyID" INTEGER,
        CONSTRAINT fk_libraryOrderPublisherID FOREIGN KEY ("libraryOrderPublisherID") REFERENCES "Publishers" ("publisherID") ON DELETE CASCADE,
        CONSTRAINT fk_libraryOrderAuthorID FOREIGN KEY ("libraryOrderAuthorID") REFERENCES "Authors" ("authorID") ON DELETE CASCADE,
        CONSTRAINT fk_libraryOrderManagerID FOREIGN KEY ("libraryOrderManagerLibrarianID") REFERENCES "Managers" ("managerLibrarianID") ON DELETE CASCADE,
        CONSTRAINT fk_libraryOrderCurrencyID FOREIGN KEY ("libraryOrderCurrencyID") REFERENCES "Currencies" ("currencyID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "Employees" CASCADE;

CREATE TABLE
    "Employees" (
        "employeeLibrarianID" INTEGER,
        "employeeTeamID" INTEGER,
        CONSTRAINT fk_employeeLibrarianID FOREIGN KEY ("employeeLibrarianID") REFERENCES "Librarians" ("librarianID") ON DELETE CASCADE,
        CONSTRAINT fk_employeeTeamID FOREIGN KEY ("employeeTeamID") REFERENCES "Teams" ("teamID") ON DELETE CASCADE
    );