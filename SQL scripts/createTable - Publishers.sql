DROP TABLE IF EXISTS "Publishers";

CREATE TABLE "Publishers" (
"publisherID" SERIAL PRIMARY KEY,
	"publisherName" varchar(255),
    "publisherAddress" varchar(255),
	"publisherEmail" varchar(255),
	"publisherPhone" varchar(255)
	
)
