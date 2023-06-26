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