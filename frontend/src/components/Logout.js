// import libraries
import * as React from "react";
import { useNavigate } from "react-router-dom";

// import required css
import { Button } from "react-bootstrap";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.setItem("loggedIn", JSON.stringify(false));
    navigate("/Login");
  };
  return (
    <div>
      <Button onClick={() => handleLogout()}>Logout</Button>
    </div>
  );
};

export default Logout;
