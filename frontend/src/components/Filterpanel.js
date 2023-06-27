//* import libraries *//
import { useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

//* import required css *//
import "../css/Filterpanel.css";
import "bootstrap/dist/css/bootstrap.min.css";

function getFilterValues() {
  const singleFilterValuesHTML = document.body.getElementsByClassName(
    "css-wsp0cs-MultiValueGeneric"
  );
  const multiFilterValuesHTML = document.body.getElementsByClassName(
    "css-1p3m7a8-multiValue"
  );

  let filterValues = Array.from(singleFilterValuesHTML).map(
    (element) => element.textContent
  );
  filterValues = filterValues.concat(
    Array.from(multiFilterValuesHTML).map((element) => element.textContent)
  );

  // Remove duplicates from filterValues
  return [...new Set(filterValues)];
}

function getLabels() {
  const singleFilterValuesHTML = document.body.getElementsByClassName(
    "css-wsp0cs-MultiValueGeneric"
  );

  return Array.from(singleFilterValuesHTML).map((element) => {
    const greatGrandparentElement =
      element.parentNode.parentNode.parentNode.parentNode.parentNode;
    const label = greatGrandparentElement.querySelector("label");
    return label ? label.textContent : "";
  });
}

function Filterpanel(props) {
  const { columns, results, setUpdateData, updateData } = props;
  const numColumns = columns.length;
  const selectRef = useRef(null);

  const handleChange = () => {
    const oldSearchQuery = sessionStorage.getItem("tableQuery");
    const filterValues = getFilterValues();
    const labels = getLabels();

    let searchQuery = `SELECT * FROM "${sessionStorage.getItem(
      "view"
    )}" WHERE `;
    if (
      sessionStorage.getItem("view") == "allLoans" &&
      sessionStorage.getItem("role") == "Reader"
    ) {
      searchQuery = `SELECT * FROM "allLoans" WHERE "Reader ID" = ${sessionStorage.getItem(
        "userID"
      )} AND `;
    }
    if (sessionStorage.getItem("view") == "enrichedTeams") {
      searchQuery = `SELECT * FROM "enrichedTeams" WHERE "Team ID" = ${sessionStorage.getItem(
        "teamID"
      )} AND `;
    }
    if (
      sessionStorage.getItem("table") == "Librarians" &&
      sessionStorage.getItem("action") == "Manage personal data"
    ) {
      searchQuery = `SELECT * FROM "Librarians" WHERE "librarianID" = ${sessionStorage.getItem(
        "userID"
      )} AND `;
    }
    if (
      sessionStorage.getItem("table") == "Readers" &&
      sessionStorage.getItem("action") == "Manage personal data"
    ) {
      searchQuery = `SELECT * FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
        "userID"
      )} AND `;
    }

    const searchQueryParts = labels.map((column, index) => {
      const filterValue = filterValues[index].trim();
      return `"${column}" = '${filterValue}'`;
    });

    const uniqueLabels = [...new Set(labels)];
    const newSearchQueryParts = uniqueLabels.map((label) => {
      const labelCount = labels.filter((l) => l === label).length;
      return labelCount === 1
        ? searchQueryParts.find((part) => part.includes(`"${label}"`))
        : `(${searchQueryParts
            .filter((part) => part.includes(`"${label}"`))
            .join(" OR ")})`;
    });
    searchQuery = searchQuery + newSearchQueryParts.join(" AND ");

    if (labels.length === 0) {
      searchQuery = `SELECT * FROM "${sessionStorage.getItem("view")}"`;
      if (
        sessionStorage.getItem("view") == "allLoans" &&
        sessionStorage.getItem("role") == "Reader"
      ) {
        searchQuery = `SELECT * FROM "allLoans" WHERE "Reader ID" = ${sessionStorage.getItem(
          "userID"
        )}`;
      }
      if (sessionStorage.getItem("view") == "enrichedTeams") {
        searchQuery = `SELECT * FROM "enrichedTeams" WHERE "Team ID" = ${sessionStorage.getItem(
          "teamID"
        )}`;
      }
      if (
        sessionStorage.getItem("table") == "Librarians" &&
        sessionStorage.getItem("action") == "Manage personal data"
      ) {
        searchQuery = `SELECT * FROM "Librarians" WHERE "librarianID" = ${sessionStorage.getItem(
          "userID"
        )}`;
      }
      if (
        sessionStorage.getItem("table") == "Readers" &&
        sessionStorage.getItem("action") == "Manage personal data"
      ) {
        searchQuery = `SELECT * FROM "Readers" WHERE "readerID" = ${sessionStorage.getItem(
          "userID"
        )}`;
      }
    }

    sessionStorage.setItem("tableQuery", searchQuery);
  };

  useEffect(() => {
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    const observeDOMChanges = () => {
      const targetNode = document.body;
      const observer = new MutationObserver(
        debounce(() => {
          handleChange();
        }, 1000)
      );

      const observerConfig = { childList: true, subtree: true };
      observer.observe(targetNode, observerConfig);
    };

    observeDOMChanges();
  }, []);

  return (
    <div className="filter-flex-container">
      {Array.from({ length: numColumns }, (_, index) => (
        <Form.Group
          className="filter-form-group"
          key={index}
          controlId={`column-${index}`}
        >
          <Form.Label>{columns[index]}</Form.Label>
          <Select
            options={Array.from(new Set(results.map((row) => row[index]))).map(
              (value) => ({
                value,
                label: value,
              })
            )}
            id="Select"
            ref={selectRef}
            isSearchable
            isMulti
            onChange={handleChange}
          />
        </Form.Group>
      ))}

      <button
        onClick={() => setUpdateData(!updateData)}
        className="btn btn-primary"
      >
        Apply filters
      </button>
    </div>
  );
}

export default Filterpanel;
