DROP VIEW IF EXISTS "allLoans" CASCADE;
Create MATERIALIZED View "allLoans" AS
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
