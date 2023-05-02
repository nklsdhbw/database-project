import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import Table from "react-bootstrap/Table";
import CreateRecordModal from "./createRecord";
import { useNavigate } from "react-router-dom";

function Views() {
  const navigate = useNavigate();
  // general variables
  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  console.log("LoginStatus", loginStatus);
  if (!loginStatus) {
    navigate("/Login");
  }
  const api = "http://localhost:5000/run-query";
  const [selectedView, setSelectedView] = useState(
    sessionStorage.getItem("view") || "allLoans"
  );

  // state variables
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [datatypes, setDatatypes] = useState([]);
  const [query, setQuery] = useState("");

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(false);

  const [shouldRender, setShouldRender] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // react hooks

  useEffect(() => {
    let query = `SELECT viewname
      FROM pg_views
      WHERE schemaname = 'public'
      ORDER BY viewname;
      `;

    axios
      .post("http://localhost:5000/run-query", {
        query,
      })
      .then((tables) => {
        console.log(tables.data);
        let views = tables.data;
        sessionStorage.setItem("view", views[0][0]);
        console.log("VIEW", sessionStorage.getItem("view"));
        setSelectedView(sessionStorage.getItem("view"));
        views.push(["myLoans"]);
        console.log("Views", views);

        setOptions(views);

        //newOptions = newOptions.concat(["myLoans"]);
        //console.log(newOptions, options);
        //setOptions([...options, "myLoans"]);
        console.log(options, views);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedView) {
      if (selectedView == "myLoans") {
        let loginMail = sessionStorage.getItem("loginMail");
        let view = sessionStorage.getItem("view");
        console.log("VIEW", view);
        const newQuery = `SELECT * FROM "allLoans" WHERE "loanReaderEmail" = '${loginMail}'`;
        setQuery(newQuery);
        setShouldRender(!shouldRender);
      } else {
        console.log("HAAALLLLOO");
        const newQuery = `SELECT * FROM "${selectedView}"`;
        setQuery(newQuery);
        setShouldRender(!shouldRender);
      }
    }
  }, [selectedView, updateData]);

  useEffect(() => {
    if (query) {
      if (selectedView == "myLoans") {
        let view = sessionStorage.getItem("view");
        axios
          .post("http://localhost:5000/run-query", { query })
          .then((response) => {
            setResults(response.data);
          })
          .catch((error) => {
            console.log(error);
          });

        axios
          .post("http://localhost:5000/run-query", {
            query: `SELECT column_name FROM information_schema.columns  WHERE table_name = '${view}' AND table_schema = 'public'`,
          })
          .then((columns) => {
            setColumns(columns.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("NEUE QUERY");
        console.log(query);
        axios
          .post("http://localhost:5000/run-query", { query })
          .then((response) => {
            setResults(response.data);
          })
          .catch((error) => {
            console.log(error);
          });

        axios
          .post("http://localhost:5000/run-query", {
            query: `SELECT column_name FROM information_schema.columns  WHERE table_name = '${selectedView}' AND table_schema = 'public'`,
          })
          .then((columns) => {
            setColumns(columns.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [query, shouldRender, selectedView]);

  // functions
  function changeView() {
    const selectElement = document.getElementById("mySelect");
    const selectedValue =
      selectElement.options[selectElement.selectedIndex].value;
    const customViews = ["myLoans"];

    if (customViews.includes(selectedValue)) {
      setSelectedView(selectedValue);
    } else {
      sessionStorage.setItem("view", selectedValue);
      setSelectedView(selectedValue);
    }
  }

  //if (!results.length) {
  // If there is no data available yet, show a loading indicator or an empty state.
  //  return <p>Loading...</p>;
  //}

  return (
    <div>
      <Table striped bordered hover className="table mx-auto">
        <thead>
          {columns.map((column) => (
            <th>{column[0]}</th>
          ))}

          <th className="col"></th>
        </thead>
        <tbody>
          {results.map((data) => (
            <tr>
              {data.map((entry) => (
                <td>{entry}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <div>
        <select id="mySelect" value={selectedView} onChange={changeView}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Views;
