DROP TABLE IF EXISTS "Authors";

CREATE TABLE "Authors" (
"authorID" SERIAL PRIMARY KEY,
	"authorName" varchar(255),
	"authorEmail" varchar(255),
	"authorPhone" varchar(255)
	
)
