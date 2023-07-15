//* import libraries *//
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import bcrypt, { hash } from "bcryptjs";
import axios from "axios";

//* import required images *//
import loginBackground from "../img/login_background.svg";

//* import required css *//
import "../css/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm();
  const [results, setResults] = useState([]);
  const api = "http://localhost:8000/run-query";

  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  console.log("LoginStatus", loginStatus);
  if (!loginStatus) {
  } else {
    navigate("/NavigationMenue");
  }

  useEffect(() => {
    let query = `SELECT * FROM "allUsers"`;
    axios
      .post(api, { query })
      .then((response) => {
        setResults(response.data[1]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = async (formData) => {
    // declare login status
    const password = formData.password;
    let loginMail = formData.username;
    sessionStorage.setItem("loggedIn", JSON.stringify(false));
    let hashedPassword;
    let userID;
    let role;
    let teamID;
    let usernames = [];
    results.forEach((element) => {
      usernames.push(element[1]);
    });

    if (!usernames.includes(loginMail)) {
      window.alert(
        "Unknown username. Please register or try different username"
      );
    } else {
      //get readerID and hashePassword from User and store readerID in session storage
      results.forEach((element) => {
        console.log(element[1], formData.username);
        if (element[1] === formData.username) {
          hashedPassword = element[3];
          userID = element[0];
          role = element[2];
          teamID = element[4];
          if (element[2] === "Reader") {
            sessionStorage.setItem("readerID", userID);
          }
          sessionStorage.setItem("userID", userID);
        }
      });

      const passwordsMatch = await bcrypt.compare(password, hashedPassword);
      console.log(hashedPassword, " : ", password);
      console.log(passwordsMatch);
      if (passwordsMatch) {
        sessionStorage.setItem("loggedIn", JSON.stringify(true));
        sessionStorage.setItem("loginMail", loginMail);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("teamID", teamID);
        sessionStorage.setItem("password", hashedPassword);
        navigate("/NavigationMenue");
      } else {
        window.alert("Wrong password or username. Please try again.");
      }
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${loginBackground})`,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Anmelden</h1>
        <div className="form-group">
          <label htmlFor="email">E-Mail-Adresse</label>
          <input
            {...register("username", { required: true })}
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="example@mail.com"
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
            placeholder="●●●●●●●●●"
          />
        </div>

        <div>
          <br></br>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formState.isValid}
          >
            Anmelden
          </button>
        </div>

        <div>
          <span>
            oder registriere dich <NavLink to="/Register">hier</NavLink>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
