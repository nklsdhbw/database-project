CREATE
OR REPLACE VIEW "allUsers" AS
SELECT
  "id",
  "username",
  "role",
  "password",
  "teamID" AS "Team ID"
FROM
  (
    SELECT
      "readerID" AS id,
      "readerEmail" AS username,
      'Reader' AS role,
      "readerPassword" AS password,
      NULL AS "teamID"
    FROM
      "Readers"
    UNION
    SELECT
      "librarianID" AS id,
      "librarianEmail" AS username,
      CASE
        WHEN "librarianID" IN (
          SELECT
            "managerLibrarianID"
          FROM
            "Managers"
        ) THEN 'Manager'
        WHEN "librarianID" IN (
          SELECT
            "employeeLibrarianID"
          FROM
            "Employees"
        ) THEN 'Employee'
        ELSE 'Librarian'
      END AS role,
      "librarianPassword" AS password,
      CASE
        WHEN "librarianID" IN (
          SELECT
            "managerLibrarianID"
          FROM
            "Managers"
        ) THEN (
          SELECT
            "managerTeamID"
          FROM
            "Managers"
          WHERE
            "managerLibrarianID" = "Librarians"."librarianID"
        )
        WHEN "librarianID" IN (
          SELECT
            "employeeLibrarianID"
          FROM
            "Employees"
        ) THEN (
          SELECT
            "employeeTeamID"
          FROM
            "Employees"
          WHERE
            "employeeLibrarianID" = "Librarians"."librarianID"
        )
        ELSE NULL
      END AS "teamID"
    FROM
      "Librarians"
  ) AS users
ORDER BY
  id;