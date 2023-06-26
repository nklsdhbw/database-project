DROP FUNCTION IF EXISTS decreaseBookAvailability () CASCADE;

CREATE FUNCTION decreaseBookAvailability () RETURNS TRIGGER AS $$
DECLARE
    book_avail_amount INTEGER;
BEGIN
    SELECT "bookAvailableAmount" INTO book_avail_amount FROM "Books" WHERE "bookID" = NEW."loanBookID";
    IF book_avail_amount > 0 THEN
        UPDATE "Books" SET "bookAvailability" = true, "bookAvailableAmount" = book_avail_amount - 1 WHERE "bookID" = NEW."loanBookID";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS decreaseBookAvailabilityTrigger ON "Loans";

CREATE TRIGGER decreaseBookAvailabilityTrigger AFTER INSERT ON "Loans" FOR EACH ROW EXECUTE FUNCTION decreaseBookAvailability ();

DROP FUNCTION IF EXISTS increaseBookAvailability () CASCADE;

CREATE FUNCTION increaseBookAvailability () RETURNS TRIGGER AS $$
BEGIN
    IF NEW."loanStatus" = ' returned ' AND OLD."loanStatus" <> ' returned ' THEN
        UPDATE "Books" SET "bookAvailableAmount" = "bookAvailableAmount" + 1 WHERE "bookID" = NEW."loanBookID";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increaseBookAvailabilityTrigger ON "Loans";

CREATE TRIGGER increaseBookAvailabilityTrigger AFTER
UPDATE ON "Loans" FOR EACH ROW EXECUTE FUNCTION increaseBookAvailability ();

CREATE
OR REPLACE PROCEDURE markOverdueLoans () AS $$
BEGIN
    UPDATE "Loans" SET "loanOverdue" = true WHERE CURRENT_DATE > "loanDueDate" AND ("loanReturnDate" IS NULL OR "loanReturnDate" > "loanDueDate");
END;
$$ LANGUAGE plpgsql;

--- Refresh materialized view allLoans ---
CREATE
OR REPLACE FUNCTION refreshAllLoans () RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW "allLoans";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS refreshAllLoansBooksTrigger ON "Books";

CREATE TRIGGER refreshAllLoansBooksTrigger AFTER INSERT
OR
UPDATE
OR DELETE ON "Books" FOR EACH ROW EXECUTE FUNCTION refreshAllLoans ();

DROP TRIGGER IF EXISTS refreshAllLoansLoansTrigger ON "Loans";

CREATE TRIGGER refreshAllLoansLoansTrigger AFTER INSERT
OR
UPDATE
OR DELETE ON "Loans" FOR EACH ROW EXECUTE FUNCTION refreshAllLoans ();

DROP TRIGGER IF EXISTS refreshAllLoansReadersTrigger ON "Readers";

CREATE TRIGGER refreshAllLoansReadersTrigger AFTER INSERT
OR
UPDATE
OR DELETE ON "Readers" FOR EACH ROW EXECUTE FUNCTION refreshAllLoans ();

DROP TRIGGER IF EXISTS refreshAllLoansAuthorsTrigger ON "Authors";

CREATE TRIGGER refreshAllLoansAuthorsTrigger AFTER INSERT
OR
UPDATE
OR DELETE ON "Authors" FOR EACH ROW EXECUTE FUNCTION refreshAllLoans ();

DROP TRIGGER IF EXISTS refreshAllLoansPublishersTrigger ON "Publishers";

CREATE TRIGGER refreshAllLoansPublishersTrigger AFTER INSERT
OR
UPDATE
OR DELETE ON "Publishers" FOR EACH ROW EXECUTE FUNCTION refreshAllLoans ();

DROP TRIGGER IF EXISTS refreshAllLoansCurrenciesTrigger ON "Currencies";

CREATE TRIGGER refreshAllLoansCurrenciesTrigger AFTER INSERT
OR
UPDATE
OR DELETE ON "Currencies" FOR EACH ROW EXECUTE FUNCTION refreshAllLoans ();