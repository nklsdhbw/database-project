DROP TABLE IF EXISTS "Authors";

CREATE TABLE "Authors" (
"authorID" SERIAL PRIMARY KEY,
	"authorFirstName" varchar(255),
	"authorLastName" varchar(255),
	"authorEmail" varchar(255),
	"authorPhone" varchar(255)
	
)
