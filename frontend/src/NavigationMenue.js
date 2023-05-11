// import libraries
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";
import { Modal, Form, Button, ModalBody } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import bcrypt from "bcryptjs";
import axios from "axios";
import Overview from "./Overview";
import loansMmanagement from "./img/loans_management.svg";
import orderManagement from "./img/order_management.svg";
import personalInformation from "./img/personal_information.svg";
import supplierManagement from "./img/supplier_management.svg";

// import required css
//import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationMenue = () => {
  const Actions = [
    {
      label: "Order overview",
      table: "LibraryOrders",
      entryQuery:
        'SELECT "libraryOrderID" AS "Library Order ID", "libraryOrderAuthorID" AS "Author" FROM "LibraryOrders"',
      formQuery:
        'SELECT "libraryOrderID", "libraryOrderAuthorID" FROM "LibraryOrders"',
      img: orderHistory,
      allowedRoles: ["manager", "employee"],
    },
    {
      label: "Manage all Loans",
      table: "Loans",
      entryQuery: 'SELECT * FROM "allLoans"',
      formQuery: 'SELECT * FROM "Loans"',
      img: loansMmanagement,
      allowedRoles: ["manager", "employee"],
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
      allowedRoles: ["manager", "employee"],
    },
    {
      label: "Manage personal data",
      table: "Readers",
      entryQuery: `SELECT "readerID" AS "ID", "readerFirstName" AS "Firstname", "readerLastName" AS "Lastname", "readerEmail" AS "Email", "readerPassword" AS "Password" FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
        "readerID"
      )}`,
      formQuery: `SELECT * FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
        "readerID"
      )}`,
      img: personalInformation,
      allowedRoles: ["manager", "employee", "admin"],
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
      allowedRoles: ["manager", "admin"],
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
      allowedRoles: ["employee"],
      //allowedRoles: ['manager'] for creating objects
    },
    // add employee mngmg
    //allowedRoles: ['manager', 'employee', 'admin']
    // add my team: allowedRoles: ['manager', 'employee']
    //  { title: 'Book Management', img: bookManagement, allowedRoles: ['manager', 'employee'] },
    //{ title: 'New Hire', img: newHire, allowedRoles: ['manager', 'admin'] },
  ];

  const navigate = useNavigate();

  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  console.log("LoginStatus", loginStatus);
  if (!loginStatus) {
    navigate("/Login");
  } else {
    //navigate("/Overview");
  }

  function handleClick(option) {
    navigate("/Overview");
    console.log(option);
    sessionStorage.setItem("table", option.table);
    const filteredActions = Actions.filter(
      (action) => action.label === option.label
    );
    console.log(filteredActions[0]);
    const entryQuery = filteredActions[0].entryQuery;
    const formQuery = filteredActions[0].formQuery;
    console.log(entryQuery, "entryQuery");
    sessionStorage.setItem("tableQuery", entryQuery);
    sessionStorage.setItem("formQuery", formQuery);
    sessionStorage.setItem(
      "columnMapping",
      JSON.stringify(filteredActions[0].columnMapping)
    );
  }

  return (
    <div>
      {Actions.map((option) => (
        <Button key={option.label} onClick={() => handleClick(option)}>
          {option.label}
          <img key={option.label} src={option.img} alt={option.img} />
        </Button>
      ))}
    </div>
  );
};

export default NavigationMenue;
