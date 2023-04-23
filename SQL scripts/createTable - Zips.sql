DROP TABLE IF EXISTS "ZIPs";

CREATE TABLE "ZIPs"(
	"zipID" SERIAL PRIMARY KEY,
    "zipCode" INTEGER,
    "zipCity" varchar(255)
)