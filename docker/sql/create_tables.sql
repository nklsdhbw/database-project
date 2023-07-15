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
        "librarianFirstName" varchar(255) NOT NULL,
        "librarianLastName" varchar(255) NOT NULL,
        "librarianEmail" varchar(255) NOT NULL,
        "librarianPhone" varchar(255) NOT NULL,
        "librarianBirthDate" DATE NOT NULL,
        "librarianPassword" varchar(255) NOT NULL
    );

DROP TABLE IF EXISTS "Publishers" CASCADE;

CREATE TABLE
    "Publishers" (
        "publisherID" SERIAL PRIMARY KEY,
        "publisherName" varchar(255) NOT NULL,
        "publisherZipID" INTEGER NOT NULL,
        "publisherStreetName" varchar(255) NOT NULL,
        "publisherHouseNumber" varchar(255) NOT NULL,
        "publisherCountry" varchar(255) NOT NULL,
        "publisherEmail" varchar(255) NOT NULL,
        "publisherPhone" varchar(255) NOT NULL,
        CONSTRAINT fk_publisherZipID FOREIGN KEY ("publisherZipID") REFERENCES "ZIPs" ("zipID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "Books" CASCADE;

CREATE TABLE
    "Books" (
        "bookID" SERIAL PRIMARY KEY,
        "bookAmount" INTEGER NOT NULL,
        "bookTitle" varchar(255) NOT NULL,
        "bookAuthorID" INTEGER NOT NULL,
        "bookISBN" varchar(255) UNIQUE NOT NULL,
        "bookPublisherID" INTEGER NOT NULL,
        "bookPublicationDate" DATE,
        "bookAvailability" BOOLEAN NOT NULL,
        "bookAvailableAmount" INTEGER NOT NULL,
        "bookCategoryID" INTEGER,
        CONSTRAINT fk_bookAuthorID FOREIGN KEY ("bookAuthorID") REFERENCES "Authors" ("authorID") ON DELETE CASCADE,
        CONSTRAINT fk_bookPublisherID FOREIGN KEY ("bookPublisherID") REFERENCES "Publishers" ("publisherID") ON DELETE CASCADE,
        CONSTRAINT fk_bookCategoryID FOREIGN KEY ("bookCategoryID") REFERENCES "Categories" ("categoryID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "Teams" CASCADE;

CREATE TABLE
    "Teams" ("teamID" SERIAL PRIMARY KEY);

DROP TABLE IF EXISTS "Loans" CASCADE;

CREATE TABLE
    "Loans" (
        "loanID" SERIAL PRIMARY KEY,
        "loanBookID" INTEGER NOT NULL,
        "loanReaderID" INTEGER NOT NULL,
        "loanLoanDate" DATE NOT NULL,
        "loanDueDate" DATE NOT NULL,
        "loanReturnDate" DATE,
        "loanStatus" varchar(255) NOT NULL DEFAULT 'open',
        "loanRenewals" INTEGER,
        "loanOverdue" BOOLEAN NOT NULL,
        "loanFine" DECIMAL NOT NULL,
        "loanCurrencyID" INTEGER NOT NULL,
        CONSTRAINT fk_loanBookID FOREIGN KEY ("loanBookID") REFERENCES "Books" ("bookID") ON DELETE CASCADE,
        CONSTRAINT fk_loanReaderID FOREIGN KEY ("loanReaderID") REFERENCES "Readers" ("readerID") ON DELETE CASCADE,
        CONSTRAINT fk_loanCurrencyID FOREIGN KEY ("loanCurrencyID") REFERENCES "Currencies" ("currencyID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "Managers" CASCADE;

CREATE TABLE
    "Managers" (
        "managerID" SERIAL PRIMARY KEY,
        "managerLibrarianID" INTEGER UNIQUE NOT NULL,
        "managerTeamID" INTEGER NOT NULL,
        UNIQUE ("managerLibrarianID", "managerTeamID"),
        CONSTRAINT fk_managerLibrarianID FOREIGN KEY ("managerLibrarianID") REFERENCES "Librarians" ("librarianID") ON DELETE CASCADE,
        CONSTRAINT fk_managerTeamID FOREIGN KEY ("managerTeamID") REFERENCES "Teams" ("teamID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "LibraryOrders" CASCADE;

CREATE TABLE
    "LibraryOrders" (
        "libraryOrderID" SERIAL PRIMARY KEY,
        "libraryOrderCost" DECIMAL NOT NULL,
        "libraryOrderDeliveryDate" DATE NOT NULL,
        "libraryOrderAmount" INTEGER NOT NULL,
        "libraryOrderDateOrdered" DATE NOT NULL,
        "libraryOrderPublisherID" INTEGER NOT NULL,
        "libraryOrderBookTitle" varchar(255) NOT NULL,
        "libraryOrderISBN" varchar(255) NOT NULL,
        "libraryOrderAuthorID" INTEGER NOT NULL,
        "libraryOrderStatusOrder" varchar(255) DEFAULT 'order' NOT NULL,
        "libraryOrderManagerLibrarianID" INTEGER NOT NULL,
        "libraryOrderCurrencyID" INTEGER NOT NULL,
        CONSTRAINT fk_libraryOrderPublisherID FOREIGN KEY ("libraryOrderPublisherID") REFERENCES "Publishers" ("publisherID") ON DELETE CASCADE,
        CONSTRAINT fk_libraryOrderAuthorID FOREIGN KEY ("libraryOrderAuthorID") REFERENCES "Authors" ("authorID") ON DELETE CASCADE,
        CONSTRAINT fk_libraryOrderManagerID FOREIGN KEY ("libraryOrderManagerLibrarianID") REFERENCES "Managers" ("managerLibrarianID") ON DELETE CASCADE,
        CONSTRAINT fk_libraryOrderCurrencyID FOREIGN KEY ("libraryOrderCurrencyID") REFERENCES "Currencies" ("currencyID") ON DELETE CASCADE
    );

DROP TABLE IF EXISTS "Employees" CASCADE;

CREATE TABLE
    "Employees" (
        "employeeLibrarianID" INTEGER UNIQUE NOT NULL,
        "employeeTeamID" INTEGER NOT NULL,
        CONSTRAINT fk_employeeLibrarianID FOREIGN KEY ("employeeLibrarianID") REFERENCES "Librarians" ("librarianID") ON DELETE CASCADE,
        CONSTRAINT fk_employeeTeamID FOREIGN KEY ("employeeTeamID") REFERENCES "Teams" ("teamID") ON DELETE CASCADE
    );