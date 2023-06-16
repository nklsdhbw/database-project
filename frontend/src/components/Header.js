import { useState } from "react";
import axios from "axios";
import chapterOneLogo from "../img/logo.svg";
import "../css/Header.css";
import Logout from "./Logout.js";

const Header = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loanFine, setLoanFine] = useState(10);
  const api = "http://localhost:5000/run-query";
  const readerID = sessionStorage.getItem("userID");
  const query = `SELECT SUM("Fine"), "Reader ID" FROM "allLoans"
  GROUP  BY "Reader ID"
  HAVING "Reader ID" = ${readerID}
  `;
  const userRole = sessionStorage.getItem("role");

  return (
    <header>
      <div className="header-container">
        <Logout />
        <div className="logo-container">
          <img src={chapterOneLogo} alt="ChapterOne Logo" />
        </div>
        <p className={userRole !== "Reader" ? "hidden-paragraph" : ""}>
          Loan Fine: {loanFine}
        </p>
      </div>
    </header>
  );
};

export default Header;
