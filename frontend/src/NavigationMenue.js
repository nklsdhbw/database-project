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

  function handleClick(table) {
    navigate("/Overview");
    sessionStorage.setItem("table", table);
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
        setOptions(tables.data.flat());
        console.log("ALL TABLES", tables.data.flat());
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }, []);

  return (
    <div>
      {options.map((option) => (
        <Button key={option} onClick={() => handleClick(option)}>
          {option}
        </Button>
      ))}
    </div>
  );
};

export default NavigationMenue;
