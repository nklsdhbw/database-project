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