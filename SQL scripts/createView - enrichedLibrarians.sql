CREATE OR REPLACE VIEW "enrichedLibrarians" AS
SELECT "librarianID" AS "ID", 
      "librarianFirstName" AS "Firstname", 
      "librarianLastName" AS "Lastname", 
      "librarianEmail" AS "Email", 
      "librarianPhone" AS "Phone", 
      "librarianBirthDate" AS "Birth date",
        "teamID" AS "Team ID",
        
        CASE
            WHEN "librarianID" IN (SELECT "managerLibrarianID" FROM "Managers") THEN 'Manager'
            WHEN "librarianID" IN (SELECT "employeeLibrarianID" FROM "Employees") THEN 'Employee'
            ELSE 'Librarian'
        END AS "Role"
        
    
    FROM "Librarians" l
    LEFT JOIN "Employees" e ON e."employeeLibrarianID" = l."librarianID"
    LEFT JOIN "Managers" m ON m."managerLibrarianID" = l."librarianID"
    LEFT JOIN "Teams" t ON "teamID" = e."employeeTeamID" OR "teamID" = m."managerTeamID";
	