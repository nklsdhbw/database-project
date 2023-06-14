//* import libraries *//
import * as React from "react";
import { useNavigate } from "react-router-dom";

//* import images *//
import logoutIcon from "../img/logout.svg";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.setItem("loggedIn", JSON.stringify(false));
    navigate("/Login");
  };
  return (
    <div>
      <button
        style={{
          background: `url(${logoutIcon}) no-repeat center`,
          backgroundSize: "contain",
          border: "none",
          width: "50px",
          height: "50px",
          cursor: "pointer",
        }}
        onClick={() => handleLogout()}
      ></button>
    </div>
  );
};

export default Logout;
