import React, { useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import bcrypt from "bcryptjs";

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
    hidePublisherButton,
    showSearchZipButton,
    showSearchCurrencyButton,
    setshowSearch,
    showSearch,
  } = props;

  const isLoanReturnDateUndefinedNullEmptyAndNoOtherEmpty =
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

  const [formValid, setFormValid] = useState(
    isLoanReturnDateUndefinedNullEmptyAndNoOtherEmpty
  );
  const formRef = useRef(null);

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditData({
      ...editData,
      [name]: { ...editData[name], placeholder: value },
    });
    if (formRef.current.checkValidity()) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  async function editEntry(data) {
    let columnsString = "";
    let query = "SET ";
    let rowID = selectedTable.slice(0, selectedTable.length - 1);
    rowID = rowID.toLowerCase();
    rowID = rowID + "ID";
    if (selectedTable == "LibraryOrders") {
      rowID = "libraryOrderID";
    }
    let keyValue = rowUniqueID;

    let arr = Object.entries(data);
    for (let index = 0; index < arr.length; index++) {
      const column = arr[index][0];
      console.log("COLUMN? ", column);
      const values = arr[index][1];
      const datatype = values.type;
      console.log(arr[index], column, values, datatype);
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
      query = query + `"${column}" = '${placeholder}',`;
    }

    axios
      .post(api, {
        query:
          `UPDATE public."${selectedTable}" ${query.slice(
            0,
            columnsString.length - 1
          )} ` + `WHERE "${rowID}" = ${keyValue}`,
      })
      .then((response) => {
        setUpdateData(!updateData);
      })
      .catch((error) => {});
  }

  const handleEditSubmit = (event) => {
    event.preventDefault();
    editEntry(editData);
    setUpdateData(!updateData);
    setShowEditModal(!showEditModal);
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
                />
              ) : (
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
                  required
                />
              )}
            </Form.Group>
          ))}
          <Button disabled={!formValid} type="submit">
            Submit Edit
          </Button>
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
          <Button hidden={hidePublisherButton} onClick={handlePublisher}>
            Search Publisher
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditRecordModal;
