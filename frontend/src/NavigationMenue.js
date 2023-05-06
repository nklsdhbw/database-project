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
    },
    {
      label: "Manage all Loans",
      table: "Loans",
      entryQuery: 'SELECT * FROM "allLoans"',
      formQuery: 'SELECT * FROM "Loans"',
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
    },
    {
      label: "Manage personal data",
      table: "Readers",
      formQuery: `SELECT * FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
        "readerID"
      )}`,
      entryQuery: `SELECT * FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
        "readerID"
      )}`,
    },
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
  }

  return (
    <div>
      {Actions.map((option) => (
        <Button key={option.label} onClick={() => handleClick(option)}>
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default NavigationMenue;
