// import libraries
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";
import "bootstrap/dist/css/bootstrap.min.css";
import bcrypt from "bcryptjs";
import axios from "axios";
import Overview from "./Overview";

// import required css
//import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm();
  const [results, setResults] = useState([]);

  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  console.log("LoginStatus", loginStatus);
  if (!loginStatus) {
    //navigate("/Login");
  } else {
    navigate("/Overview");
  }

  //let { isLoading, data } = useFetch("/api/login");
  useEffect(() => {
    let query = 'SELECT * FROM public."Readers"';
    axios
      .post("http://localhost:5000/run-query", { query })
      .then((response) => {
        setResults(response.data);
        console.log(response.data);
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
      console.log(element[2], formData.username);
      if (element[2] == formData.username) {
        hashedPassword = element[3];
        readerID = element[0];
        sessionStorage.setItem("readerID", readerID);
      }
    });

    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    console.log(hashedPassword, password);
    console.log(passwordsMatch);
    if (passwordsMatch) {
      sessionStorage.setItem("loggedIn", JSON.stringify(true));
      sessionStorage.setItem("loginMail", loginMail);
      navigate("/Overview");
    } else {
      window.alert("Pech");
    }

    // iterate over the data from /api/login and check if the inputs are in the array(=database)
    // lowercase input email, so that the case of the input email doesn't matter
    /*
    let loginData = data;

    loginData.forEach((element) => {
      if (
        formData.username.toLowerCase() === element.eMail &&
        formData.password === element.password
      ) {
        // set user specific variables and store them in session storage of browser
        // after successfull login navigate to overview page
        sessionStorage.setItem("loggedIn", JSON.stringify(true));
        navigate("overview");
      }
    });

    // alert user if password or email is false
    if (!JSON.parse(sessionStorage.getItem("loggedIn"))) {
      window.alert("invalid password or email!");
    }
    // }
    */
  };

  /*
  // dont do sth, until data isnt loaded
  if (!isLoading) {
    //check if user is already logged in, if so, automatically redirect to overview
    if (JSON.parse(sessionStorage.getItem("loggedIn"))) {
      window.location.href = "/overview";
    } else {
      // user is not logged in
      // return login mask
      // checks if email input is email type
      // input fields are set ro required to prevent user from submitting (button is disabled until the validation doesn't fail anymore)
*/
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
