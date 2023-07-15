import { useState, useEffect } from "react";
import axios from "axios";
import chapterOneLogo from "../img/logo.svg";
import "../css/Header.css";
import Logout from "./Logout.js";
import { set } from "react-hook-form";

const Header = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loanFine, setLoanFine] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const api = "http://localhost:8000/run-query";
  const readerID = sessionStorage.getItem("userID");
  const userRole = sessionStorage.getItem("role");
  const username = sessionStorage.getItem("loginMail");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    fetchLoanFine();
  }, []);

  function fetchLoanFine() {
    setIsFetching(true);
    console.log("fetchLoanFine started");
    let query = `SELECT "Reader ID", SUM("Fine") AS total_fine
    FROM "allLoans"
    GROUP BY "Reader ID"
    HAVING "Reader ID" = '${readerID}';
    `;
    axios
      .post(api, { query: query })
      .then((response) => {
        let fine;
        try {
          const tempfine = response.data[1][0][1];
          fine = tempfine;
        } catch {
          //no loans -> set loanfin to 0
          fine = 0;
        }
        console.log("FINE", fine);
        if (fine !== loanFine) {
          setLoanFine(fine);
        }
        setIsFetching(false);
      })
      .catch((error) => {});
  }
  if (isFetching) {
  }

  return (
    <header>
      <div className="header-container">
        <Logout />
        <div className="logo-container">
          <img src={chapterOneLogo} alt="ChapterOne Logo" />
        </div>
        <div>
          <p>
            {username} | {role}
          </p>
          <p className={userRole !== "Reader" ? "hidden-paragraph" : ""}>
            Loan Fine: {loanFine}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
