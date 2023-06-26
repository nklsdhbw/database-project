DROP VIEW IF EXISTS "enrichedTeams" CASCADE;

CREATE VIEW
  "enrichedTeams" AS
SELECT
  "librarianID" AS "ID",
  "librarianFirstName" AS "Firstname",
  "librarianLastName" AS "Lastname",
  "librarianEmail" AS "Email",
  "librarianPhone" AS "Phone",
  "librarianBirthDate" AS "Birth date",
  "employeeTeamID" AS "Team ID"
FROM
  "Teams" t
  JOIN "Employees" e ON e."employeeTeamID" = t."teamID"
  JOIN "Librarians" l ON "employeeLibrarianID" = l."librarianID"
ORDER BY
  "librarianID";