// import libraries
import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs";
import axios from "axios";

// import required css

import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  // fetch loginData from /api/login
  //const { isLoading, data } = useFetch("/api/login");

  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [existingUsers, setExistingUsers] = useState([]);
  const [userExists, setUserExists] = useState(false);

  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  console.log("LoginStatus", loginStatus);
  if (loginStatus != "true") {
  } else {
    navigate("/Overview");
  }
  // check if user already exists
  useEffect(() => {
    let query = 'SELECT * FROM public."Readers"';
    axios
      .post("http://localhost:5000/run-query", { query })
      .then((response) => {
        setExistingUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // continue when data is fully loaded

  const onSubmit = async (registerData) => {
    const password = registerData.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const fullName = registerData.firstname + " " + registerData.lastname;
    const email = registerData.eMail;
    console.log(existingUsers);
    for (let i = 0; i < existingUsers.length; i++) {
      if (existingUsers[i][2] === email) {
        console.log("hallo?");
        setUserExists(true);
        window.alert("User already exists. Please login");
        navigate("/Login");
        break;
      }
    }
    console.log("HÄÄ");

    if (!userExists) {
      let query2 = `INSERT INTO public."Readers" ("readerName", "readerEmail", "readerPassword") Values('${fullName}', '${registerData.eMail}', '${hashedPassword}')`;
      console.log("QUERY", query2);
      // after registration, user is logged in so change loggedIn variable to true
      // and navigate then to the "overview" page
      sessionStorage.setItem("loggedIn", JSON.stringify(true));
      sessionStorage.setItem("loginMail", registerData.eMail);
      axios
        .post("http://localhost:5000/run-query", {
          query: `INSERT INTO public."Readers" ("readerName", "readerEmail", "readerPassword") Values('${fullName}', '${registerData.eMail}', '${hashedPassword}')`,
        })
        .then((response) => {
          setResults(response.data);

          //get readerData from database
          axios
            .post("http://localhost:5000/run-query", {
              query: `SELECT * FROM public."Readers"`,
            })
            .then((response) => {
              setResults(response.data);
              let results = response.data;
              //get readerID from User and save it in sessionStorage
              console.log(results);
              results.forEach((element) => {
                if (element[2] == registerData.eMail) {
                  let readerID = element[0];
                  sessionStorage.setItem("readerID", readerID);
                  navigate("/overview");
                }
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // return form with input fields for registrating a new user
  // disable the "register" button if inputValidation is false,
  // for example empty input fields or not an input with eMail format in email input field
  return (
    <form novalidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h1>Registrieren</h1>
      </div>

      <div className="form-group">
        <label>Vorname</label>
        <input
          {...register("firstname", { required: true })}
          className="form-control"
          id="firstname"
          placeholder="Max"
        />
      </div>

      <div className="form-group">
        <label>Nachname</label>
        <input
          {...register("lastname", { required: true })}
          className="form-control"
          id="lastname"
          placeholder="Mustermann"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">E-Mail-Adresse</label>
        <input
          {...register("eMail", { required: true })}
          type="email"
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          placeholder="max.mustermann@mail.com"
        />
        <small id="emailHelp" className="form-text text-muted">
          Wir werden deine E-Mail-Adresse nicht weitergeben.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="password">Passwort</label>
        <input
          {...register("password", { required: true })}
          type="password"
          className="form-control"
          id="password"
          placeholder="●●●●●●●●●●"
        />
      </div>

      <div id="register">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!formState.isValid}
        >
          Registrieren
        </button>
      </div>
    </form>
  );
};

export default Register;
