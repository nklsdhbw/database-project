//* import libraries *//
import * as React from "react";
import { useNavigate } from "react-router-dom";

//* import images *//
import logoutIcon from "../img/logout.svg";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.setItem("loggedIn", JSON.stringify(false));
    sessionStorage.clear();
    navigate("/Login");
  };
  return (
    <div>
      <button
        title="Logout"
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
