DROP TABLE IF EXISTS "Managers";

CREATE TABLE "Managers" (
    "managerLibrarianID" INTEGER,
    "managerTeamID" INTEGER,
    UNIQUE ("managerLibrarianID", "managerTeamID"),

    CONSTRAINT fk_managerLibrarianID
      FOREIGN KEY("managerLibrarianID") 
	  REFERENCES "Librarians"("librarianID")
	  ON DELETE CASCADE,
    
    CONSTRAINT fk_managerTeamID
      FOREIGN KEY("managerTeamID") 
	  REFERENCES "Teams"("teamTeamID")
	  ON DELETE CASCADE
)