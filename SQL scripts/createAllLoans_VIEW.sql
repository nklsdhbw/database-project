DROP View IF EXISTS "allLoans";

Create View "allLoans" AS
SELECT b."bookTitle", b."bookAuthor", b."bookISBN", l."loanReaderEmail", l."loanLoanDate", l."loanDueDate", l."loanReturnDate", r."readerName"
FROM "Books" b
JOIN "Loans" l ON b."bookID"=l."loanBookID"
JOIN "Readers" r ON l."loanReaderEmail" = r."readerEmail"