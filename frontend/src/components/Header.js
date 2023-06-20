import { useState } from "react";
import axios from "axios";
import chapterOneLogo from "../img/logo.svg";
import "../css/Header.css";
import Logout from "./Logout.js";
import { set } from "react-hook-form";

const Header = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loanFine, setLoanFine] = useState(10);
  const api = "http://localhost:5000/run-query";
  const readerID = sessionStorage.getItem("userID");
  const userRole = sessionStorage.getItem("role");

  fetchLoanFine();

  function fetchLoanFine() {
    let query = `SELECT "Reader ID", SUM("Fine") AS total_fine
    FROM "allLoans"
    GROUP BY "Reader ID"
    HAVING "Reader ID" = '${readerID}';
    `;
    axios
      .post(api, { query: query })
      .then((response) => {
        const fine = response.data[1][0][1];
        if (fine !== loanFine) {
          setLoanFine(fine);
        }
      })
      .catch((error) => {});
  }

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
