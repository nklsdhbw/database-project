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
      query:
        'SELECT "libraryOrderID", "libraryOrderAuthorID" FROM "LibraryOrders"',
    },
    {
      label: "All Loans",
      table: "Loans",
      query: 'SELECT * FROM "Loans"',
    },
  ];

  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [options, setOptions] = useState([]);

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
      (action) => action.table === option.table
    );
    const orderOverviewQuery = filteredActions[0].query;
    //const orderOverviewQuery = filteredActions.map((action) => action.query)[0];
    sessionStorage.setItem("query", orderOverviewQuery);
  }

  useEffect(() => {
    let query = `SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
      `;
    axios
      .post("http://localhost:5000/run-query", {
        query,
      })
      .then((tables) => {
        setOptions(tables[0].data.flat());
        console.log("ALL TABLES", tables[0].data.flat());
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }, []);

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
