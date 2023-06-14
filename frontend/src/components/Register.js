//* import libraries *//
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs";
import axios from "axios";
import PasswordChecklist from "react-password-checklist";

//* import required images *//
import loginBackground from "../img/login_background.svg";

//* import css *//
import "../css/Login.css";

const Register = () => {
  const api = "http://localhost:5000/run-query";
  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate();
  const [existingUsers, setExistingUsers] = useState([]);
  const [userExists, setUserExists] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [formStateValid, setFormStateValid] = useState(false);
  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));

  // navigate to NavigationMenue if user is already logged in
  if (!loginStatus) {
  } else {
    navigate("/NavigationMenue");
  }

  // fetch current Readers
  getReaders();

  //* HANDLERS *//
  const onSubmit = async (registerData) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const email = registerData.eMail;

    for (let i = 0; i < existingUsers.length; i++) {
      if (existingUsers[i][3] === email) {
        setUserExists(true);
        window.alert("User already exists. Please login");
        navigate("/Login");
        break;
      }
    }

    if (!userExists) {
      // after registration, user is logged in so change loggedIn variable to true
      // and navigate then to the "overview" page
      sessionStorage.setItem("loggedIn", JSON.stringify(true));
      sessionStorage.setItem("loginMail", registerData.eMail);

      let registerParameters = [
        registerData.firstname,
        registerData.lastname,
        registerData.username,
        hashedPassword,
      ];

      createReader(registerParameters, registerData);
    }
  };

  //* FUNCTIONS *//
  async function getReaders() {
    let query = 'SELECT * FROM public."Readers"';
    try {
      const response = await axios.post(api, { query });
      await new Promise((resolve) => {
        setExistingUsers(response.data[1], () => resolve());
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function createReader(registerParameters, registerData) {
    const response = await axios.post(api, {
      query: `INSERT INTO public."Readers" ("readerFirstName", "readerLastName", "readerEmail", "readerPassword") Values(%s, %s, %s, %s)`,
      parameters: registerParameters,
    });

    await getReaders();
    let results = existingUsers;

    //get readerID from User and save it in sessionStorage
    results.forEach((element) => {
      if (element[1] === registerData.username) {
        let userID = element[0];
        let role = element[2];
        let teamID = element[4];
        let loginMail = element[1];
        sessionStorage.setItem("teamID", teamID);
        sessionStorage.setItem("loginMail", loginMail);
        sessionStorage.setItem("role", role);
        if (element[2] === "Reader") {
          sessionStorage.setItem("readerID", userID);
        }
        sessionStorage.setItem("userID", userID);
      }
    });
    navigate("/NavigationMenue");
  }

  // return form with input fields for registrating a new user
  // disable the "register" button if inputValidation is false,
  // for example empty input fields or not an input with eMail format in email input field

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
          <label htmlFor="firstname">Firstname</label>
          <input
            {...register("firstname", { required: true })}
            type="text"
            className="form-control"
            id="firstname"
            placeholder="Max"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Lastname</label>
          <input
            {...register("lastname", { required: true })}
            type="text"
            className="form-control"
            id="lastname"
            placeholder="Mustermann"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-Mail-Adresse</label>
          <input
            {...register("username", {
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />

          <br></br>
          <label htmlFor="password">Password again:</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
          <br></br>
          <PasswordChecklist
            rules={["minLength", "specialChar", "number", "capital", "match"]}
            minLength={5}
            value={password}
            valueAgain={passwordAgain}
            onChange={(isValid) => {
              console.log(isValid);
              setFormStateValid(isValid);
            }}
          />
        </div>
        <div>
          <br></br>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formState.isValid || !formStateValid}
            id="registerButton"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
