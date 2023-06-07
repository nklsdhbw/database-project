DROP TABLE IF EXISTS "Publishers";

CREATE TABLE
	"Publishers" (
		"publisherID" SERIAL PRIMARY KEY,
		"publisherName" varchar(255),
		"publisherZipID" INTEGER,
		"publisherStreetName" varchar(255),
		"publisherHouseNumber" varchar(255),
		"publisherCountry" varchar(255),
		"publisherEmail" varchar(255),
		"publisherPhone" varchar(255),
		CONSTRAINT fk_publisherCurrencyCode FOREIGN KEY ("publisherZipID") REFERENCES "ZIPs" ("zipID") ON DELETE CASCADE
	)