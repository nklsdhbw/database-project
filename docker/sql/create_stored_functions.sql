DROP FUNCTION IF EXISTS updateBookAvailability() CASCADE;
CREATE FUNCTION updateBookAvailability()
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

DROP TRIGGER IF EXISTS updateBookAvailabilityTrigger ON "Loans";
CREATE TRIGGER updateBookAvailabilityTrigger
AFTER INSERT ON "Loans"
FOR EACH ROW
EXECUTE FUNCTION updateBookAvailability();
