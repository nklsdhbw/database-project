//* import libraries *//
import React, { useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SearchAttributes from "./SearchAttributes";
import "../css/Buttons.css";

function CreateRecordModal(props) {
  const {
    showModal,
    handleCreate,
    formData,
    datatypes,
    showSearchBookButton,
    showSearchAuthorButton,
    showSearchManagerButton,
    hidePublisherButton,
    setShowModal,
    setFormData,
    setUpdateData,
    updateData,
    setshowSearch,
    showSearch,
    api,
    selectedTable,
    showSearchZipButton,
    showSearchCurrencyButton,
    showSearchTeamButton,
    showSearchEmployeeButton,
    showSearchReaderButton,
  } = props;

  // event handler
  const handleInputChange = (event) => {
    var selectElement = document.getElementById("Role");
    var selectedOption = selectElement.options[selectElement.selectedIndex];

    var selectedValue = selectedOption.value;
    formData["Role"].placeholder = selectedValue;
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: { ...formData[name], placeholder: value },
    });
    if (formRef.current.checkValidity()) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const bcrypt = require("bcryptjs");
  const [formValid, setFormValid] = useState(false);
  const formRef = useRef(null);

  let disabledColumns = ["loanStatus"];
  let columns = Object.keys(formData);
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].endsWith("ID")) {
      disabledColumns.push(columns[i]);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedTable === "Teams") {
      addTeamMember(formData);
    } else if (selectedTable === "Librarians") {
      createNewEmployee(formData);
    } else {
      if (formData.librarianPassword) {
        // Hash the password using bcryptjs
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(
            formData.librarianPassword.placeholder,
            salt,
            (err, hash) => {
              // Update the formData with the hashed password
              const updatedFormData = {
                ...formData,
                librarianPassword: {
                  ...formData.librarianPassword,
                  placeholder: hash,
                },
              };

              // Call addEntry with the updated formData
              addEntry(updatedFormData);
              setUpdateData(!updateData);
              setShowModal(!showModal);
            }
          );
        });
      } else {
        // Call addEntry with the original formData
        addEntry(formData);
        setUpdateData(!updateData);
        setShowModal(!showModal);
      }
    }
  };

  function addTeamMember(data) {
    axios
      .post(api, {
        query: `UPDATE "Employees" SET "employeeTeamID" = ${data["employeeTeamID"].placeholder} WHERE "employeeLibrarianID" = ${data["employeeLibrarianID"].placeholder}`,
      })
      .then((response) => {
        setUpdateData(!updateData);
      });
  }

  function createNewEmployee(data) {
    // Hash the password using bcryptjs
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(data.librarianPassword.placeholder, salt, (err, hash) => {
        // Update the formData with the hashed password
        data.librarianPassword.placeholder = hash;
      });
    });

    function sliceObjectByIndex(obj, n) {
      const keys = Object.keys(obj);
      const slicedKeys = keys.slice(0, n);
      return Object.fromEntries(slicedKeys.map((key) => [key, obj[key]]));
    }
    const slicedObject = sliceObjectByIndex(data, 6);

    let valuesString = "VALUES(";
    let columnsString = "";
    let librariansParameter = [];
    let values = Object.entries(slicedObject).map(([key, value]) => {
      valuesString = valuesString + `%s,`;
      librariansParameter.push(value.placeholder);
    });
    let columns = Object.entries(slicedObject).map(
      ([key, value]) => (columnsString = columnsString + `"${key}",`)
    );
    console.log(valuesString, columnsString);

    let librariansQuery =
      `INSERT INTO public."${selectedTable}" (${columnsString.slice(
        0,
        columnsString.length - 1
      )})` + `${valuesString.slice(0, valuesString.length - 1)}) `;
    console.log(data);

    let managerOrEmployeeQuery;
    if (
      data["Role"].placeholder == "Manager" &&
      (data["employeeTeamID"].placeholder != null ||
        data["employeeTeamID"].placeholder != undefined)
    ) {
      managerOrEmployeeQuery = `INSERT INTO "Managers" ("managerLibrarianID", "managerTeamID")
        SELECT "librarianID", ${data["employeeTeamID"].placeholder}
        FROM "Librarians"
        WHERE "librarianEmail" = '${data["librarianEmail"].placeholder}';`;
    }
    if (
      data["Role"].placeholder == "Employee" &&
      (data["employeeTeamID"].placeholder != null ||
        data["employeeTeamID"].placeholder != undefined)
    ) {
      console.log("TEEEEST");
      managerOrEmployeeQuery = `INSERT INTO "Employees" ("employeeLibrarianID", "employeeTeamID")
      SELECT "librarianID", ${data["employeeTeamID"].placeholder}
      FROM "Librarians"
      WHERE "librarianEmail" = '${data["librarianEmail"].placeholder}';`;
    }
    console.log(
      data["employeeTeamID"].placeholder == null ||
        data["employeeTeamID"].placeholder == undefined
    );
    if (
      data["Role"].placeholder == "Manager" &&
      (data["employeeTeamID"].placeholder == null ||
        data["employeeTeamID"].placeholder == undefined)
    ) {
      console.log("INNN");
      managerOrEmployeeQuery = `INSERT INTO "Managers" ("managerLibrarianID")
        SELECT "librarianID"
        FROM "Librarians"
        WHERE "librarianEmail" = '${data["librarianEmail"].placeholder}';`;
    }
    if (
      data["Role"].placeholder == "Employee" &&
      (data["employeeTeamID"].placeholder == null ||
        data["employeeTeamID"].placeholder == undefined)
    ) {
      managerOrEmployeeQuery = `INSERT INTO "Employees" ("employeeLibrarianID")
      SELECT "librarianID"
      FROM "Librarians"
      WHERE "librarianEmail" = '${data["librarianEmail"].placeholder}';`;
    }

    console.log(managerOrEmployeeQuery, "managerOrEmployeeQuery");
    let parameters = [];
    parameters.push(data["employeeTeamID"].placeholder);
    parameters.push(data["librarianEmail"].placeholder);

    axios
      .post(api, {
        query: librariansQuery,
        parameters: librariansParameter,
      })
      .then((response) => {
        axios
          .post(api, {
            query: managerOrEmployeeQuery,
            parameters: parameters,
          })
          .then((response) => {
            setUpdateData(!updateData);
            setShowModal(!showModal);
          })
          .catch((error) => {
            console.log("ERROR : ", error);
          });
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }

  function addEntry(data) {
    let valuesString = "VALUES(";
    let columnsString = "";

    // remove columns that are not filled
    // atm this can only be true for loanReturnDate as it is the
    // only optional column, all the other ones are required and therefore
    // cant be empty
    data = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          value.placeholder !== undefined &&
          value.placeholder !== null &&
          value.placeholder !== ""
      )
    );

    let values = Object.entries(data).map(
      ([key, value]) =>
        //(valuesString = valuesString + `'${value.placeholder}',`)
        (valuesString = valuesString + `%s,`)
    );
    let columns = Object.entries(data).map(
      ([key, value]) => (columnsString = columnsString + `"${key}",`)
    );
    let insqertQuery =
      `INSERT INTO public."${selectedTable}" (${columnsString.slice(
        0,
        columnsString.length - 1
      )})` + `${valuesString.slice(0, valuesString.length - 1)}) `;
    console.log(insqertQuery);
    let parameters = [];
    for (const [key, value] of Object.entries(data)) {
      parameters.push(value.placeholder);
    }
    axios
      .post(api, {
        query: insqertQuery,
        parameters,
      })
      .then((response) => {
        //stored function is executed in the background that updates bookAvailability and bookAvailabilityAmount
        axios
          .post(api, {
            query: `CALL markOverdueLoans();`,
          })
          .then((response) => {
            setUpdateData(!updateData);
          })
          .catch((error) => {
            console.log("ERROR : ", error);
          });
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }
  return (
    <Modal show={showModal}>
      <Modal.Header>
        <Modal.Title>Create New Record</Modal.Title>
        <Button variant="secondary" aria-label="Close" onClick={handleCreate}>
          Close
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} ref={formRef}>
          {Object.entries(formData).map(([key, value], index) => (
            <Form.Group key={index}>
              <Form.Label>{String(key)}</Form.Label>
              {datatypes[index] === "option" ? (
                <Form.Control
                  id="Role"
                  as="select"
                  name={key}
                  value={value.placeholder}
                  onChange={handleInputChange}
                  required
                  disabled={disabledColumns.includes(key)}
                >
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </Form.Control>
              ) : key === "loanReturnDate" ? (
                <Form.Control
                  name={key}
                  value={value.placeholder}
                  onChange={handleInputChange}
                  type={datatypes[index]}
                  disabled={disabledColumns.includes(key)}
                />
              ) : (
                <Form.Control
                  name={key}
                  value={value.placeholder}
                  onChange={handleInputChange}
                  required
                  type={datatypes[index]}
                  disabled={disabledColumns.includes(key)}
                />
              )}
            </Form.Group>
          ))}
          <div className="button-container">
            <Button type="submit" disabled={!formValid}>
              Create
            </Button>
            <SearchAttributes
              showSearchAuthorButton={showSearchAuthorButton}
              showSearchBookButton={showSearchBookButton}
              showSearchCurrencyButton={showSearchCurrencyButton}
              showSearchEmployeeButton={showSearchEmployeeButton}
              showSearchManagerButton={showSearchManagerButton}
              showSearchReaderButton={showSearchReaderButton}
              showSearchTeamButton={showSearchTeamButton}
              showSearchZipButton={showSearchZipButton}
              hidePublisherButton={hidePublisherButton}
              setshowSearch={setshowSearch}
              showSearch={showSearch}
            />
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateRecordModal;
