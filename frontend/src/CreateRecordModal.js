import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CreateRecordModal({
  showModal,
  handleCreate,
  formData,
  handleSubmit,
  handleInputChange,
  datatypes,
  showSearchBookButton,
  showSearchAuthorButton,
  showSearchManagerButton,
  hidePublisherButton,
  handleBook,
  handleAuthor,
  handleManager,
  handlePublisher,
}) {
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
          <Button hidden={hidePublisherButton} onClick={handlePublisher}>
            Search Publisher
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateRecordModal;
