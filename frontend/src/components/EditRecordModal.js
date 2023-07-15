//* import libraries *//
import React, { useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import bcrypt from "bcryptjs";
import SearchAttributes from "./SearchAttributes";

import "../css/Buttons.css";

function EditRecordModal(props) {
  const {
    showEditModal,
    setShowEditModal,
    updateData,
    setUpdateData,
    editData,
    datatypes,
    setEditData,
    columns,
    selectedTable,
    api,
    rowUniqueID,
    showSearchBookButton,
    showSearchAuthorButton,
    showSearchManagerButton,
    showSearchEmployeeButton,
    hidePublisherButton,
    showSearchZipButton,
    showSearchCurrencyButton,
    showSearchReaderButton,
    showSearchTeamButton,
    setshowSearch,
    showSearch,
  } = props;

  /*const isLoanReturnDateUndefinedNullEmptyAndNoOtherEmpty =
    Object.entries(editData).every(([key, value]) =>
      key === "loanReturnDate"
        ? value.placeholder === undefined ||
          value.placeholder === null ||
          value.placeholder === ""
        : value.placeholder !== undefined &&
          value.placeholder !== null &&
          value.placeholder !== ""
    ) &&
    Object.values(editData).some(
      (value) =>
        value.placeholder === undefined ||
        value.placeholder === null ||
        value.placeholder === ""
    );
    */

  const [formValid, setFormValid] = useState(false);
  const formRef = useRef(null);

  let disabledColumns = ["loanStatus"];
  let dbColumns = Object.keys(editData);
  for (let i = 0; i < dbColumns.length; i++) {
    if (dbColumns[i].endsWith("ID")) {
      disabledColumns.push(dbColumns[i]);
    }
  }

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditData({
      ...editData,
      [name]: { ...editData[name], placeholder: value },
    });
    const excludedFields = ["loanReturnDate"];
    const isFormValid = Object.entries(formData).every(([key, value]) => {
      // Check if the field is excluded from validation
      if (excludedFields.includes(key)) {
        return true; // Skip validation for this field
      }

      // Check the validity of the field
      const inputElement = formRef.current.elements[key];
      return inputElement.checkValidity();
    });
    setFormValid(isFormValid);
  };

  async function editEntry(data) {
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

    let columnsString = "";
    let query = "SET ";
    let rowID = selectedTable.slice(0, selectedTable.length - 1);
    rowID = rowID.toLowerCase();
    rowID = rowID + "ID";
    if (selectedTable == "LibraryOrders") {
      rowID = "libraryOrderID";
    }
    let keyValue = rowUniqueID;
    let parameters = [];
    let arr = Object.entries(data);
    for (let index = 0; index < arr.length; index++) {
      const column = arr[index][0];
      const values = arr[index][1];
      const datatype = values.type;
      let placeholder = values.placeholder;

      if (datatype == "password") {
        const password = values.placeholder;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        placeholder = hashedPassword;
      }
      if (datatype == "date") {
        console.log(placeholder);
        placeholder = new Date(placeholder).toISOString().slice(0, 10);
      }
      query = query + `"${column}" = %s,`;
      parameters.push(placeholder);
    }
    query =
      `UPDATE public."${selectedTable}" ${query.slice(
        0,
        columnsString.length - 1
      )} ` + `WHERE "${rowID}" = ${keyValue}`;
    console.log("PARAMETERS: ", parameters);
    console.log("QUERY: ", query);

    axios
      .post(api, {
        query: query,
        parameters,
      })
      .then((response) => {
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

  const handleEditSubmit = (event) => {
    event.preventDefault();
    editEntry(editData);
    setUpdateData(!updateData);
    setShowEditModal(!showEditModal);
  };

  return (
    <Modal show={showEditModal}>
      <Modal.Header>
        <Modal.Title>Edit Record</Modal.Title>
        <Button
          variant="secondary"
          aria-label="Close"
          onClick={() => setShowEditModal(!showEditModal)}
        >
          Close
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditSubmit} ref={formRef}>
          {Object.entries(editData).map(([key, value], index) => (
            <Form.Group controlId={`${String(key)}`}>
              <Form.Label>{`${String(key)}`}</Form.Label>
              {key === "loanReturnDate" ? (
                <Form.Control
                  type={datatypes[index]} //`${String(value.type)}`}
                  name={`${String(key)}`}
                  value={
                    value.type == "date" && !isNaN(new Date(value.placeholder))
                      ? new Date(value.placeholder).toISOString().slice(0, 10)
                      : `${value.placeholder}`
                  }
                  onChange={handleEditInputChange}
                  readOnly={key == columns[0] ? true : false}
                  disabled={disabledColumns.includes(key)}
                />
              ) : (
                <Form.Control
                  type={value.type} //`${String(value.type)}`}
                  name={`${String(key)}`}
                  value={
                    value.type == "date" && !isNaN(new Date(value.placeholder))
                      ? new Date(value.placeholder).toISOString().slice(0, 10)
                      : `${value.placeholder}`
                  }
                  onChange={handleEditInputChange}
                  readOnly={key == columns[0] ? true : false}
                  required
                  disabled={disabledColumns.includes(key)}
                />
              )}
            </Form.Group>
          ))}
          <div className="button-container">
            <Button disabled={!formValid} type="submit">
              Submit Edit
            </Button>
            <SearchAttributes
              showSearchAuthorButton={showSearchAuthorButton}
              showSearchBookButton={showSearchBookButton}
              showSearchCurrencyButton={showSearchCurrencyButton}
              showSearchManagerButton={showSearchManagerButton}
              showSearchReaderButton={showSearchReaderButton}
              showSearchTeamButton={showSearchTeamButton}
              showSearchZipButton={showSearchZipButton}
              hidePublisherButton={hidePublisherButton}
              showSearchEmployeeButton={showSearchEmployeeButton}
              setshowSearch={setshowSearch}
              showSearch={showSearch}
            />
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditRecordModal;
