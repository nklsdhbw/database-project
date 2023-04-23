DROP TABLE IF EXISTS "Loans";

CREATE TABLE "Loans" (
    "loanID" SERIAL PRIMARY KEY,
	"loanBookID" INTEGER,
    "loanReaderID" INTEGER,
    "loanLoanDate" DATE,
    "loanDueDate" DATE,
    "loanReturnDate" DATE,
    "loanRenewals" INTEGER,
    "loanOverdue" BOOLEAN,
    "loanFine" DECIMAL,
    "loanCurrencyID" INTEGER,
    

	CONSTRAINT fk_loanBookID
      FOREIGN KEY("loanBookID") 
	  REFERENCES "Books"("bookID")
	  ON DELETE CASCADE,

      CONSTRAINT fk_loanReaderID
      FOREIGN KEY("loanReaderID") 
	  REFERENCES "Readers"("readerID")
	  ON DELETE CASCADE,

      CONSTRAINT fk_loanCurrencyID
      FOREIGN KEY("loanCurrencyID") 
	  REFERENCES "Currencies"("currencyID")
	  ON DELETE CASCADE
)
