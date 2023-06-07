DROP FUNCTION IF EXISTS decreaseBookAvailability() CASCADE;
CREATE FUNCTION decreaseBookAvailability()
RETURNS TRIGGER AS $$
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
CREATE TRIGGER decreaseBookAvailabilityTrigger
AFTER INSERT ON "Loans"
FOR EACH ROW
EXECUTE FUNCTION decreaseBookAvailability();


DROP FUNCTION IF EXISTS increaseBookAvailability() CASCADE;
CREATE FUNCTION increaseBookAvailability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."loanStatus" = 'returned' AND OLD."loanStatus" <> 'returned' THEN
        UPDATE "Books" SET "bookAvailableAmount" = "bookAvailableAmount" + 1 WHERE "bookID" = NEW."loanBookID";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increaseBookAvailabilityTrigger ON "Loans";
CREATE TRIGGER increaseBookAvailabilityTrigger
AFTER UPDATE ON "Loans"
FOR EACH ROW
EXECUTE FUNCTION increaseBookAvailability();


CREATE OR REPLACE PROCEDURE markOverdueLoans()
AS $$
BEGIN
    UPDATE "Loans" SET "loanOverdue" = true WHERE CURRENT_DATE > "loanDueDate" AND ("loanReturnDate" IS NULL OR "loanReturnDate" > "loanDueDate");
END;
$$ LANGUAGE plpgsql;



