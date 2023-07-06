-- Query 1: Retrieve the books with the highest number of loans
SELECT
    b."bookTitle",
    l."loanCount"
FROM
    (
        SELECT
            "loanBookID",
            COUNT("loanID") AS "loanCount"
        FROM
            "Loans"
        GROUP BY
            "loanBookID"
    ) AS l
    INNER JOIN "Books" b ON l."loanBookID" = b."bookID"
WHERE
    l."loanCount" = (
        SELECT
            MAX("loanCount")
        FROM
            (
                SELECT
                    "loanBookID",
                    COUNT("loanID") AS "loanCount"
                FROM
                    "Loans"
                GROUP BY
                    "loanBookID"
            ) AS l
    );

-- Query 2: Retrieve the readers who have loaned all available books
SELECT
    r."readerFirstName",
    r."readerLastName"
FROM
    "Readers" r
WHERE
    NOT EXISTS (
        SELECT
            "bookID"
        FROM
            "Books"
        WHERE
            NOT EXISTS (
                SELECT
                    "loanID"
                FROM
                    "Loans"
                WHERE
                    "loanBookID" = "bookID"
                    AND "loanReaderID" = r."readerID"
            )
    );

-- Query 3: Retrieve the authors who have written books in all categories
SELECT
    concat (a."authorFirstName", ' ', a."authorLastName") AS "authorName"
FROM
    "Authors" a
WHERE
    NOT EXISTS (
        SELECT
            "categoryID"
        FROM
            "Categories"
        WHERE
            NOT EXISTS (
                SELECT
                    "bookID"
                FROM
                    "Books"
                WHERE
                    "bookAuthorID" = a."authorID"
                    AND "bookCategoryID" = "categoryID"
            )
    );

-- Query 4: Retrieve the books, the loan count of this book and the average loan count over all books
-- that have been loaned more than the average number of loans
SELECT
    b."bookTitle",
    (
        SELECT
            COUNT("loanID")
        FROM
            "Loans"
        WHERE
            "loanBookID" = b."bookID"
    ) AS "loanCount",
    (
        SELECT
            AVG("loanCount")
        FROM
            (
                SELECT
                    "loanBookID",
                    COUNT("loanID") AS "loanCount"
                FROM
                    "Loans"
                GROUP BY
                    "loanBookID"
            ) AS l
    ) AS "averageLoanCount"
FROM
    "Books" b
WHERE
    (
        SELECT
            COUNT("loanID")
        FROM
            "Loans"
        WHERE
            "loanBookID" = b."bookID"
    ) > (
        SELECT
            AVG("loanCount")
        FROM
            (
                SELECT
                    "loanBookID",
                    COUNT("loanID") AS "loanCount"
                FROM
                    "Loans"
                GROUP BY
                    "loanBookID"
            ) AS l
    );

-- Query 5: Retrieve the readers who have loaned books published by a specific publisher
SELECT
    concat (r."readerFirstName", ' ', r."readerLastName") AS "readerName"
FROM
    "Readers" r
WHERE
    EXISTS (
        SELECT
            *
        FROM
            "Books" b
            INNER JOIN "Loans" l ON b."bookID" = l."loanBookID"
            INNER JOIN "Publishers" p ON b."bookPublisherID" = p."publisherID"
        WHERE
            l."loanReaderID" = r."readerID"
            AND p."publisherName" = 'Penguin Books'
    );

-- Query 6: Retrieve the authors who have written books that are loaned by a specific reader
SELECT
    concat (a."authorFirstName", ' ', a."authorLastName") AS "authorName"
FROM
    "Authors" a
WHERE
    EXISTS (
        SELECT
            *
        FROM
            "Books" b
            INNER JOIN "Loans" l ON b."bookID" = l."loanBookID"
        WHERE
            b."bookAuthorID" = a."authorID"
            AND l."loanReaderID" = 1
    );

-- Query 7: Retrieve the books that have not been loaned
SELECT
    "bookTitle"
FROM
    "Books"
WHERE
    "bookID" NOT IN (
        SELECT DISTINCT
            "loanBookID"
        FROM
            "Loans"
    );

-- Query 8: Retrieve the publishers that have published books in all categories
SELECT
    p."publisherName"
FROM
    "Publishers" p
WHERE
    (
        SELECT
            COUNT(DISTINCT "bookCategoryID")
        FROM
            "Books" b
        WHERE
            b."bookPublisherID" = p."publisherID"
    ) = (
        SELECT
            COUNT("categoryID")
        FROM
            "Categories"
    );

-- Query 9: Retrieve the readers who have loaned books by all authors
SELECT
    r."readerFirstName",
    r."readerLastName"
FROM
    "Readers" r
WHERE
    (
        SELECT
            COUNT(DISTINCT b."bookAuthorID")
        FROM
            "Books" b
            INNER JOIN "Loans" l ON b."bookID" = l."loanBookID"
        WHERE
            l."loanReaderID" = r."readerID"
    ) = (
        SELECT
            COUNT(DISTINCT "authorID")
        FROM
            "Authors"
    );

-- Query 10: Retrieve the books with the highest average loan duration
SELECT
    b."bookTitle",
    AVG(l."loanDueDate" - l."loanLoanDate") AS "averageLoanDuration"
FROM
    "Books" b
    INNER JOIN "Loans" l ON b."bookID" = l."loanBookID"
GROUP BY
    b."bookID"
HAVING
    AVG(l."loanDueDate" - l."loanLoanDate") = (
        SELECT
            MAX("averageLoanDuration")
        FROM
            (
                SELECT
                    b."bookID",
                    AVG(l."loanDueDate" - l."loanLoanDate") AS "averageLoanDuration"
                FROM
                    "Books" b
                    INNER JOIN "Loans" l ON b."bookID" = l."loanBookID"
                GROUP BY
                    b."bookID"
            ) AS a
    );