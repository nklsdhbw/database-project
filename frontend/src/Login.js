// import libraries
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";
import "bootstrap/dist/css/bootstrap.min.css";
import bcrypt from "bcryptjs";
import axios from "axios";

// import required css
//import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm();
  const [results, setResults] = useState([]);

  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  console.log("LoginStatus", loginStatus);
  if (!loginStatus) {
  } else {
    navigate("/NavigationMenue");
  }

  //let { isLoading, data } = useFetch("/api/login");
  useEffect(() => {
    let query = 'SELECT * FROM public."Readers"';
    axios
      .post("http://localhost:5000/run-query", { query })
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
    let readerID;

    //get readerID and hashePassword from User and store readerID in session storage
    results.forEach((element) => {
      console.log(element[3], formData.username);
      if (element[3] == formData.username) {
        hashedPassword = element[4];
        readerID = element[0];
        sessionStorage.setItem("readerID", readerID);
      }
    });

    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    console.log(hashedPassword, " : ", password);
    console.log(passwordsMatch);
    if (passwordsMatch) {
      sessionStorage.setItem("loggedIn", JSON.stringify(true));
      sessionStorage.setItem("loginMail", loginMail);
      navigate("/NavigationMenue");
    } else {
      window.alert("Wrong password or username. Please try again.");
    }
  };

  return (
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
  );
};
//  }
//};

export default Login;
