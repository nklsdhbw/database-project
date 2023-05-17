import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

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
  } = props;

  // event handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: { ...formData[name], placeholder: value },
    });
  };

  const bcrypt = require("bcryptjs");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
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

  function handlePublisher() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Publishers");
  }
  function handleZip() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "ZIPs");
  }

  function handleBook() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Books");
  }
  function handleAuthor() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Authors");
  }

  function handleManager() {
    sessionStorage.setItem("searchTable", "Managers");
    setshowSearch(!showSearch);
  }
  function handleCurrency() {
    sessionStorage.setItem("searchTable", "Currencies");
    setshowSearch(!showSearch);
  }
  function handleTeam() {
    sessionStorage.setItem("searchTable", "Teams");
    setshowSearch(!showSearch);
  }
  function handleEmployee() {
    sessionStorage.setItem("searchTable", "Employees");
    setshowSearch(!showSearch);
  }

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

    let values = Object.entries(slicedObject).map(
      ([key, value]) =>
        (valuesString = valuesString + `'${value.placeholder}',`)
    );
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

    let managerOrEmployeeQuery =
      data["Role"] == "Manager"
        ? `INSERT INTO "Managers" ("managerLibrarianID", "managerTeamID")
        SELECT "librarianID", ${data["employeeTeamID"].placeholder}
        FROM "Librarians"
        WHERE "librarianEmail" = '${data["librarianEmail"].placeholder}';`
        : `INSERT INTO "Employees" ("employeeLibrarianID", "employeeTeamID")
        SELECT "librarianID", ${data["employeeTeamID"].placeholder}
        FROM "Librarians"
        WHERE "librarianEmail" = '${data["librarianEmail"].placeholder}';`;

    axios
      .post(api, {
        query: librariansQuery,
      })
      .then((response) => {
        axios
          .post(api, {
            query: managerOrEmployeeQuery,
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
    let values = Object.entries(data).map(
      ([key, value]) =>
        (valuesString = valuesString + `'${value.placeholder}',`)
    );
    let columns = Object.entries(data).map(
      ([key, value]) => (columnsString = columnsString + `"${key}",`)
    );
    axios
      .post(api, {
        query:
          `INSERT INTO public."${selectedTable}" (${columnsString.slice(
            0,
            columnsString.length - 1
          )})` + `${valuesString.slice(0, valuesString.length - 1)}) `,
      })
      .then((response) => {
        //stored function is executed in the background that updates bookAvailability and bookAvailabilityAmount
        setUpdateData(!updateData);
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
        <Form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value], index) => (
            <Form.Group controlId={String(key)} key={index}>
              <Form.Label>{String(key)}</Form.Label>
              {datatypes[index] === "option" ? (
                <Form.Control
                  as="select"
                  name={key}
                  value={value.placeholder}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </Form.Control>
              ) : (
                <Form.Control
                  name={key}
                  value={value.placeholder}
                  onChange={handleInputChange}
                  required
                  type={datatypes[index]}
                />
              )}
            </Form.Group>
          ))}

          <Button type="submit">Create</Button>
          {showSearchBookButton && (
            <Button onClick={handleBook}>Search Book</Button>
          )}
          {showSearchAuthorButton && (
            <Button onClick={handleAuthor}>Search Author</Button>
          )}
          {showSearchManagerButton && (
            <Button onClick={handleManager}>Search Manager</Button>
          )}
          {showSearchZipButton && (
            <Button onClick={handleZip}>Search Zip</Button>
          )}
          {showSearchCurrencyButton && (
            <Button onClick={handleCurrency}>Search Currency</Button>
          )}
          {showSearchTeamButton && (
            <Button onClick={handleTeam}>Search Team</Button>
          )}
          {showSearchEmployeeButton && (
            <Button onClick={handleEmployee}>Search Employee</Button>
          )}

          <Button hidden={hidePublisherButton} onClick={handlePublisher}>
            Search Publisher
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateRecordModal;
