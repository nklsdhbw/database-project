import { Modal, Form, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import axios from 'axios';
function CreateRecordModal({ show, handleClose, handleCreate }) {
    const [formData, setFormData] = useState({
      librarianID: "",
      librarianName: "",
      librarianEmail: "",
      librarianPhone: "",
    });
    const api = "http://localhost:5000/run-query"
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };
  
    function addEntry(librarianData) {
        
        axios
          .post(api, {
            query: `INSERT INTO public."${"Librarians"}" ("librarianID", "librarianName", "librarianEmail", "librarianPhone") 
            VALUES(${librarianData.librarianID},'${librarianData.librarianName}','${librarianData.librarianEmail}','${librarianData.librarianPhone}') `
          })
          .then((response) => {
            //setResults(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }


    const handleSubmit = (event) => {
      event.preventDefault();
      handleCreate(formData);
      setFormData({ librarianID:"", librarianName: "", librarianEmail: "", librarianPhone: "" });
      addEntry(formData)
    };
  
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
          <Form.Group controlId="librarianID">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                name="librarianID"
                value={formData.librarianID}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="librarianName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="librarianName"
                value={formData.librarianName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="librarianEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="librarianEmail"
                value={formData.librarianEmail}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="librarianPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="librarianPhone"
                value={formData.librarianPhone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button type="submit">Create</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
export default CreateRecordModal  