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
