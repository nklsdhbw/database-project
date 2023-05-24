// import libraries
import * as React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import loansMmanagement from "./img/loans_management.svg";
import orderManagement from "./img/order_management.svg";
import personalInformation from "./img/personal_information.svg";
import supplierManagement from "./img/supplier_management.svg";
import employeeManagement from "./img/employee_management.svg";
import bookManagement from "./img/book_management.svg";
import "./dashboard.css";

// import required css
//import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationMenue = () => {
  const Actions = [
    {
      label: "Manage all Loans",
      table: "Loans",
      entryQuery: 'SELECT * FROM "allLoans"',
      formQuery: 'SELECT * FROM "Loans"',
      img: loansMmanagement,
      read: ["Manager", "Employee"],
      write: ["Manager", "Employee"],
    },
    {
      label: "Manage my Loans",
      table: "Loans",
      entryQuery: `SELECT * FROM "allLoans" where "User" = '${sessionStorage.getItem(
        "loginMail"
      )}'`,
      formQuery: `SELECT * FROM "Loans" where "loanReaderID" = ${sessionStorage.getItem(
        "readerID"
      )}`,
      img: loansMmanagement,
      read: ["Manager", "Employee", "Reader"],
      write: ["Manager", "Employee"],
    },
    {
      label: "Manage personal data",
      table: "Readers",
      entryQuery: {
        Reader: `SELECT "readerID" AS "ID", "readerFirstName" AS "Firstname", "readerLastName" AS "Lastname", "readerEmail" AS "Email", "readerPassword" AS "Password" FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
          "readerID"
        )}`,
        Librarian: `SELECT "librarianID" AS "ID", "librarianFirstName" AS "Firstname", "librarianLastName" AS "Lastname", "librarianEmail" AS "Email", "librarianPhone" AS "Phone", "librarianBirthDate" AS "Birth date", "librarianPassword" AS "Password" FROM "Librarians" WHERE "librarianID" = ${sessionStorage.getItem(
          "userID"
        )}`,
      },
      formQuery: {
        Reader: `SELECT * FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
          "userID"
        )}`,
        Librarian: `SELECT * FROM "Librarians" WHERE "librarianID" = ${sessionStorage.getItem(
          "userID"
        )}`,
      },
      img: personalInformation,
      read: ["Manager", "Employee", "Admin", "Reader"],
      write: [],
    },
    {
      label: "Manage library orders",
      table: "LibraryOrders",
      formQuery: `SELECT * FROM "LibraryOrders"`,
      entryQuery: `SELECT * FROM "enrichedLibraryOrders"`,
      img: orderManagement,
      read: ["Manager", "admin", "Employee"],
      write: ["Manager", "admin"],
    },
    {
      label: "Manage publishers",
      table: "Publishers",
      formQuery: `SELECT * FROM "Publishers"`,
      entryQuery: `SELECT * FROM "enrichedPublishers"`,
      columnMapping: {
        publisherID: "Publisher ID",
        publisherName: "Name",
        zipCode: "Zip",
        zipCity: "City",
        publisherStreetName: "Street",
        publisherHouseNumber: "Housenumber",
        publisherCountry: "Country",
        publisherEmail: "Email",
        publisherPhone: "Phone",
      },
      img: supplierManagement,
      read: ["Employee", "Manager"],
      write: ["Manager", "admin"],
    },
    {
      label: "Manage librarians",
      table: "Librarians",
      entryQuery: `SELECT * FROM "enrichedLibrarians"`,
      formQuery: `SELECT * FROM "Librarians"`,
      img: employeeManagement,
      read: ["Manager", "Employee", "Reader", "Admin"],
      write: ["Manager", "Admin"],
    },
    {
      label: "My team",
      table: "Teams",
      entryQuery: `SELECT * FROM "enrichedTeams"
          WHERE "teamID" = ${sessionStorage.getItem("teamID")};
    `,
      formQuery: `SELECT 'dummy', "employeeTeamID", "employeeLibrarianID", 'dummy2' FROM "Employees"`,
      img: employeeManagement,
      read: ["Manager", "Employee", "Admin"],
      write: ["Manager", "Admin"],
    },
    {
      label: "Manage books",
      table: "Books",
      entryQuery: `SELECT * FROM "enrichedBooks"`,
      formQuery: `SELECT * FROM "Books"`,
      img: bookManagement,
      read: ["Manager", "Employee", "Reader", "Admin"],
      write: [],
    },
    // add employee mngmg
    //read: ['manager', 'employee', 'admin']
    // add my team: read: ['manager', 'employee']
    //  { title: 'Book Management', img: bookManagement, read: ['manager', 'employee'] },
    //{ title: 'New Hire', img: newHire, read: ['manager', 'admin'] },
  ];

  const navigate = useNavigate();

  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  console.log("LoginStatus", loginStatus);
  if (!loginStatus) {
    navigate("/Login");
  } else {
    //navigate("/Overview");
  }
  const filteredActions = Actions.filter((action) =>
    action.read.includes(sessionStorage.getItem("role"))
  );

  function handleClick(option) {
    navigate("/Overview");
    console.log(option);
    sessionStorage.setItem("table", option.table);
    if (option.label === "Manage personal data") {
      if (sessionStorage.getItem("role") === "Reader") {
        sessionStorage.setItem("table", sessionStorage.getItem("role") + "s");
      } else {
        sessionStorage.setItem("table", "Librarians");
      }
    }
    const filteredActions = Actions.filter(
      (action) => action.label === option.label
    );
    console.log(filteredActions[0]);
    let entryQuery = filteredActions[0].entryQuery;
    let formQuery = filteredActions[0].formQuery;
    const createRecordPermission = filteredActions[0].write;
    let hideEditButtonActions = ["Manage librarians", "My team"];
    if (option.label === "Manage personal data") {
      entryQuery = entryQuery[sessionStorage.getItem("role")];
      formQuery = formQuery[sessionStorage.getItem("role")];
    }
    if (hideEditButtonActions.includes(option.label)) {
      sessionStorage.setItem("hideEditButton", true);
    } else {
      sessionStorage.setItem("hideEditButton", false);
    }

    console.log(entryQuery, "entryQuery");
    sessionStorage.setItem("tableQuery", entryQuery);
    sessionStorage.setItem("formQuery", formQuery);

    sessionStorage.setItem(
      "columnMapping",
      JSON.stringify(filteredActions[0].columnMapping)
    );
    sessionStorage.setItem(
      "createRecordPermission",
      createRecordPermission.includes(sessionStorage.getItem("role"))
    );
  }

  return (
    <div>
      <h1>My Dashboard</h1>
      <div className="container">
        {filteredActions.map((option) => (
          <button
            className="button"
            key={option.label}
            onClick={() => handleClick(option)}
          >
            <img key={option.label} src={option.img} alt={option.label} />
            {option.label}
          </button>
        ))}
      </div>
      <footer>
        <p>
          This website was developed as a project at the DHBW Mannheim by
          Niklas, Luca, and Aref.
        </p>
      </footer>
    </div>
  );
}; // Schließende Klammer fehlte hier

export default NavigationMenue;
