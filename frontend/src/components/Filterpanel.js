//* import libraries *//
import { useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

//* import required css *//
import "../css/Filterpanel.css";

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
  const numColumns = results.length > 0 ? results[0].length : 0;
  const selectRef = useRef(null);

  const handleChange = () => {
    const filterValues = getFilterValues();
    const labels = getLabels();

    let searchQuery = `SELECT * FROM "${sessionStorage.getItem(
      "view"
    )}" WHERE `;
    const oldSearchQuery = sessionStorage.getItem("tableQuery");
    labels.forEach((column, index) => {
      const filterValue = filterValues[index].trim();
      searchQuery += `"${column}" = '${filterValue}' AND `;
    });

    if (labels.length === 0) {
      searchQuery = `SELECT * FROM "${sessionStorage.getItem("view")}"`;
    } else {
      searchQuery = searchQuery.slice(0, searchQuery.length - 4);
    }

    sessionStorage.setItem("tableQuery", searchQuery);
    const updatedSearchQuery = oldSearchQuery !== searchQuery;
    if (updatedSearchQuery) {
      console.log("Spinner is loading");
      setUpdateData(!updateData);
    }
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
    </div>
  );
}

export default Filterpanel;