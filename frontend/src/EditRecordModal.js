import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditRecordModal(props) {
  const {
    showEditModal,
    setShowEditModal,
    handleEditSubmit,
    editData,
    datatypes,
    handleEditInputChange,
    columns,
  } = props;

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
        <Form onSubmit={handleEditSubmit}>
          {Object.entries(editData).map(([key, value], index) => (
            <Form.Group controlId={`${String(key)}`}>
              <Form.Label>{`${String(key)}`}</Form.Label>
              <Form.Control
                type={datatypes[index]} //`${String(value.type)}`}
                name={`${String(key)}`}
                value={
                  value.type == "date" && !isNaN(new Date(value.placeholder))
                    ? new Date(value.placeholder).toISOString().slice(0, 10)
                    : `${value.placeholder}`
                }
                //{`${value.placeholder}`}
                onChange={handleEditInputChange}
                required
                readOnly={key == columns[0] ? true : false}
              />
            </Form.Group>
          ))}
          <Button type="submit">Submit Edit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditRecordModal;
