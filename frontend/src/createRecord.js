import { Modal, Form, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import axios from 'axios';
function CreateRecordModal({ show, handleClose, handleCreate }) {

  
  const [formData, setFormData] = useState({
    librarianID: { type: "number", required: true, placeholder: "123" },
    librarianName: { type: "text", required: true, placeholder: "" },
    librarianEmail: { type: "email", required: true, placeholder: "" },
    librarianPhone: { type: "text", required: false, placeholder: ""},
  });
  
    const api = "http://localhost:5000/run-query"
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: { ...formData[name], placeholder: value } });
    };
    
  
    function addEntry(librarianData) {
        let valuesString = "VALUES("
        let columnsString = ''
        let table = '"Librarians"'
        let values = Object.entries(librarianData).map(([key, value])=> (
          valuesString = valuesString + `'${value.placeholder}',`
        ))
        let columns = Object.entries(librarianData).map(([key, value])=> (
          columnsString = columnsString + `"${key}",`
        ))
        axios
          .post(api, {
            query: `INSERT INTO public.${table} (${columnsString.slice(0, columnsString.length-1)})`+ 
            `${valuesString.slice(0, valuesString.length-1)}) `
          })
          .then((response) => {
            //setResults(response.data);
            console.log(response.data);
            sessionStorage.setItem('updateData', !Boolean(JSON.parse(sessionStorage.getItem('updateData'))))
            console.log(sessionStorage.getItem('updateData'))
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
          {Object.entries(formData).map(([key, value])=> (
  <Form.Group controlId={`${String(key)}`}>
    <Form.Label>{`${String(key)}`}</Form.Label>
    <Form.Control
      type={`${String(value.type)}`}
      name={`${String(key)}`}
      value={`${value.placeholder}`}
      onChange={handleInputChange}
      required
    />
  </Form.Group>
            ))}
            <Button type="submit">Create</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
export default CreateRecordModal  