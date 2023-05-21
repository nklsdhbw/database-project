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
        [`${sessionStorage.getItem(
          "role"
        )}`]: `SELECT "readerID" AS "ID", "readerFirstName" AS "Firstname", "readerLastName" AS "Lastname", "readerEmail" AS "Email", "readerPassword" AS "Password" FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
          "readerID"
        )}`,
        [`${sessionStorage.getItem(
          "role"
        )}`]: `SELECT "librarianID" AS "ID", "librarianFirstName" AS "Firstname", "librarianLastName" AS "Lastname", "librarianEmail" AS "Email", "librarianPhone" AS "Phone", "librarianBirthDate" AS "Birth date", "librarianPassword" AS "Password" FROM "Librarians" WHERE "librarianID" = ${sessionStorage.getItem(
          "userID"
        )}`,
      },
      formQuery: {
        [`${sessionStorage.getItem(
          "role"
        )}`]: `SELECT * FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
          "userID"
        )}`,
        [`${sessionStorage.getItem(
          "role"
        )}`]: `SELECT * FROM "Librarians" WHERE "librarianID" = ${sessionStorage.getItem(
          "userID"
        )}`,
      },
      img: personalInformation,
      read: ["Manager", "Employee", "Admin", "Reader"],
      write: ["Manager", "Employee", "Admin", "Reader"],
    },
    {
      label: "Manage library orders",
      table: "LibraryOrders",
      formQuery: `SELECT * FROM "LibraryOrders"`,
      entryQuery: `SELECT "libraryOrderID" as "Library Order ID",
      "libraryOrderBookTitle" AS "Book title",
      "libraryOrderISBN" AS "ISBN",
      concat(a."authorFirstName",a."authorLastName")  as "Author",
      "libraryOrderAmount" AS "Order amount",
      "libraryOrderCost" as "Cost",
      c."currencyName" AS "Currency",
      "libraryOrderDateOrdered" AS "Order date",
      "libraryOrderDeliveryDate" AS "Delivery Date",
      "libraryOrderStatusOrder" AS "Order status",
      concat(l."librarianFirstName", ' ', l."librarianLastName") AS "Manager",
      "authorID" AS "Author ID",
      "currencyID" AS "Currency ID",
      "libraryOrderManagerLibrarianID" AS "Librarian ID",
      "libraryOrderPublisherID" AS "Publisher ID"
      
      
  FROM "LibraryOrders" lo
  JOIN "Authors" a ON lo."libraryOrderAuthorID" = a."authorID"
  JOIN "Currencies" c ON lo."libraryOrderCurrencyID" = c."currencyID"
  JOIN "Librarians" l ON lo."libraryOrderManagerLibrarianID" = l."librarianID";`,
      img: orderManagement,
      read: ["Manager", "admin", "Employee"],
      write: ["Manager", "admin"],
    },
    {
      label: "Manage publishers",
      table: "Publishers",
      formQuery: `SELECT * FROM "Publishers"`,
      entryQuery: `SELECT 
      "publisherID" AS "Publisher ID",
      "publisherName" AS "Name",
      z."zipCode" AS "Zip",
      z."zipCity" AS "City",
        "publisherStreetName" AS "Street",
      "publisherHouseNumber" AS "Housenumber",
      "publisherCountry" AS "Country",
      "publisherEmail" AS "Email",
      "publisherPhone" AS "Phone"
    FROM "Publishers" p
    JOIN "ZIPs" z ON p."publisherZipID" = z."zipID"
    `,
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
      entryQuery: `SELECT "librarianID" AS "ID", 
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
    LEFT JOIN "Teams" t ON "teamID" = e."employeeTeamID" OR "teamID" = m."managerTeamID"`,
      formQuery: `SELECT * FROM "Librarians"`,
      img: employeeManagement,
      read: ["Manager", "Employee", "Reader", "Admin"],
      write: ["Manager", "Admin"],
    },
    {
      label: "My team",
      table: "Teams",
      entryQuery: `SELECT 
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
      entryQuery: `SELECT 
      "bookID" AS "ID",
  "bookTitle" AS "Title",
  "bookISBN" AS "ISBN",
   "authorFirstName" AS "Author firstname",
      "authorLastName" AS "Author lastname",
   "publisherName" AS "Publisher",
    "categoryName" AS "Category",
      "bookPublicationDate" AS "Publication date",
      "bookAmount" AS "Amount (total)",
   "bookAvailableAmount" AS "Amount (available)",
      "bookAvailability" AS "Availability"
  FROM 
    "Books" b
  JOIN "Authors" a ON a."authorID" = b."bookAuthorID"
  JOIN "Categories" c ON c."categoryID" = b."bookCategoryID"
  JOIN "Publishers" p ON p."publisherID" = b."bookPublisherID";
    `,
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
