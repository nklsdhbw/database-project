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
  } = props;

  // event handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: { ...formData[name], placeholder: value },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    addEntry(formData);
    setUpdateData(!updateData);
    setShowModal(!showModal);
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
            <Form.Group controlId={`${String(key)}`} key={index}>
              <Form.Label>{`${String(key)}`}</Form.Label>

              <Form.Control
                name={key}
                value={formData[key]["placeholder"]}
                onChange={handleInputChange}
                required
                type={datatypes[index]}
              />
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
          <Button hidden={hidePublisherButton} onClick={handlePublisher}>
            Search Publisher
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateRecordModal;
