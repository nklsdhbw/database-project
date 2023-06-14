import { useRef } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import "../css/Filterpanel.css";

function Filterpanel(props) {
  const { columns, results, setUpdateData, updateData } = props;
  const numColumns = results.length > 0 ? results[0].length : 0;
  const selectRef = useRef(null);
  const handleChange = () => {
    let singleFilterValuesHTML = document.body.getElementsByClassName(
      "css-wsp0cs-MultiValueGeneric"
    );
    let filterValues = [];
    for (let index = 0; index < singleFilterValuesHTML.length; index++) {
      let element = singleFilterValuesHTML[index];
      filterValues.push(element.textContent);
    }
    let multiFilterValuesHTML = document.body.getElementsByClassName(
      "css-1p3m7a8-multiValue"
    );
    for (let index = 0; index < multiFilterValuesHTML.length; index++) {
      let element = multiFilterValuesHTML[index];
      filterValues.push(element.textContent);
    }

    //remove duplicates from filterValues
    filterValues = [...new Set(filterValues)];

    let labels = [];
    for (let i = 0; i < singleFilterValuesHTML.length; i++) {
      let greatGrandparentElement =
        singleFilterValuesHTML[i].parentNode.parentNode.parentNode.parentNode
          .parentNode;
      let label = greatGrandparentElement.querySelector("label");
      if (label) {
        labels.push(label.textContent);
      }
    }

    let searchQuery = `SELECT * FROM "${sessionStorage.getItem(
      "view"
    )}" WHERE `;
    let oldSearchQuery = sessionStorage.getItem("tableQuery");
    labels.map((column, index) => {
      let filterValue = filterValues[index];
      filterValue = filterValue.trim();
      searchQuery = searchQuery + `"${column}" = '${filterValue}' AND `;
    });
    if (labels.length === 0) {
      searchQuery = `SELECT * FROM "${sessionStorage.getItem("view")}"`;
      sessionStorage.setItem("tableQuery", searchQuery);
    } else {
      searchQuery = searchQuery.slice(0, searchQuery.length - 4);
      sessionStorage.setItem("tableQuery", searchQuery);
    }
    let updatedSearchQuery = oldSearchQuery === searchQuery ? false : true;
    console.log(
      "updatedSearchQuery",
      updatedSearchQuery,
      oldSearchQuery,
      searchQuery
    );
    console.log("updatedSearchQuery", updatedSearchQuery);
    if (updatedSearchQuery === true) {
      console.log("Spinner is loading");
      setUpdateData(!updateData);
    }
  };

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
        // Execute your code when DOM changes occur
        handleChange();
      }, 1000) // Specify the delay (in milliseconds) you want between executions
    );

    const observerConfig = { childList: true, subtree: true };

    observer.observe(targetNode, observerConfig);
  };

  // Start observing DOM changes immediately
  observeDOMChanges();
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
