DROP TABLE IF EXISTS "Employees" CASCADE;

CREATE TABLE "Employees" (
    "employeeLibrarianID" INTEGER,
    "employeeTeamID" INTEGER,

    CONSTRAINT fk_employeeLibrarianID
      FOREIGN KEY("employeeLibrarianID") 
	  REFERENCES "Librarians"("librarianID")
	  ON DELETE CASCADE,
    CONSTRAINT fk_employeeTeamID
      FOREIGN KEY("employeeTeamID") 
	  REFERENCES "Teams"("teamID")
	  ON DELETE CASCADE
);