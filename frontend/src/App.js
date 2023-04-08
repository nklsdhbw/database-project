import { useState, useEffect } from 'react';
import { Modal, Form, Button } from "react-bootstrap";
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import Table from 'react-bootstrap/Table';
import CreateRecordModal from './createRecord';

function App() {
  const api = "http://localhost:5000/run-query"
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [query, setQuery] = useState('');
  let table = "Librarians"
  let tableID = table.toLowerCase().slice(0, table.length - 1) + "ID"
  const [options, setOptions] = useState(["Librarians", "Authors"]);
  const [selectedTable, setSelectedTable] = useState(sessionStorage.getItem('table') || "Librarians");
  let temp = selectedTable.slice(0, selectedTable.length-1)
  temp = temp.toLowerCase()
  temp = temp + "ID"
  
  const [uniqueColumn, setUniqueColumn] = useState(temp);
  const [shouldRender, setShouldRender] = useState(false);
  const [updateData, setUpdateData] = useState(false);

  
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreateRecord = (formData) => {
    console.log(formData);
    // Call API to create record
    handleCloseModal();
  };
  

useEffect(() => {
  if (selectedTable) {
    console.log("HAALLO")
    const newQuery = `SELECT * FROM "${selectedTable}"`;
    temp = selectedTable.slice(0, selectedTable.length-1)
    temp = temp.toLowerCase()
    temp = temp + "ID"
    setUniqueColumn(temp)
    setQuery(newQuery);
    setShouldRender(!shouldRender);
  }
}, [selectedTable, updateData]);


useEffect(() => {
  if (query) {
    console.log("B")
    axios
      .post('http://localhost:5000/run-query', { query })
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .post('http://localhost:5000/run-query', { query: `SELECT column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'` })
      .then((columns) => {
        setColumns(columns.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}, [query,shouldRender]);


  function changeTable(){
    const selectElement = document.getElementById("mySelect");
    const selectedValue = selectElement.options[selectElement.selectedIndex].value;
    sessionStorage.setItem("table",selectedValue);
    setSelectedTable(selectedValue);
  }
  


  //new
  const [formData, setFormData] = useState({
    librarianID: { type: "number", required: true, placeholder: "123" },
    librarianName: { type: "text", required: true, placeholder: "" },
    librarianEmail: { type: "email", required: true, placeholder: "" },
    librarianPhone: { type: "text", required: false, placeholder: ""},
  });
  
    
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
        setFormData({ librarianID:"", librarianName: "", librarianEmail: "", librarianPhone: "" });
        addEntry(formData)
        setUpdateData(!updateData)
      };


  if (!results.length) {
    // If there is no data available yet, show a loading indicator or an empty state.
    return <p>Loading...</p>;
  }

  function deleteEntry(rowID) {
    const tempTable = selectedTable;
    axios
      .post(api, {
        query: `DELETE FROM public."${selectedTable}" WHERE "${uniqueColumn}" = ${rowID}`
      })
      .then((response) => {
        //setResults(response.data);
        //setShouldRender(!shouldRender);
        //setSelectedTable(tempTable)
        setUpdateData(!updateData)
        console.log("test")
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }



  return (
    <div>
    <Table striped bordered hover className="table mx-auto">
      <thead>
          {columns.map((column)=> (
            <th>{column[0]}</th>
          ))}

          <th className="col"></th>

      </thead>
      <tbody>
        {results.map((librarianData) => (
          <tr >
            {librarianData.map((entry)=>(
              <td>{entry}</td>
            ))}
            <td>
              <button className="w-100 btn btn-lg btn-primary" onClick={() => deleteEntry(librarianData[0])}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <div>
    <button onClick={() => setShowModal(!showModal)}>Create New Record</button>
    <Modal show={showModal} onHide={!showModal}>
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
    </div>
    <div>
      <select id="mySelect" value={selectedTable} onChange={changeTable}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      </div>
      </div>
     



   

    
   
    
  );
}

export default App;
