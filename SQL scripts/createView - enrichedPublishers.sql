CREATE
OR REPLACE VIEW "enrichedPublishers" AS
SELECT
  "publisherID" AS "Publisher ID",
  "publisherName" AS "Name",
  z."zipCode" AS "Zip",
  z."zipCity" AS "City",
  "publisherStreetName" AS "Street",
  "publisherHouseNumber" AS "Housenumber",
  "publisherCountry" AS "Country",
  "publisherEmail" AS "Email",
  "publisherPhone" AS "Phone"
FROM
  "Publishers" p
  JOIN "ZIPs" z ON p."publisherZipID" = z."zipID";