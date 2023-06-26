CREATE
OR REPLACE PROCEDURE markOverdueLoans () AS $$
BEGIN
    UPDATE "Loans" SET "loanOverdue" = true WHERE CURRENT_DATE > "loanDueDate" AND ("loanReturnDate" IS NULL OR "loanReturnDate" > "loanDueDate");
END;
$$ LANGUAGE plpgsql;