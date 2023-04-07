import { useState, useEffect } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import Table from 'react-bootstrap/Table';
import CreateRecordModal from './createRecord';

function App() {
  const api = "http://localhost:5000/run-query"
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const query = 'SELECT * FROM public."Librarians"';
  let table = "Librarians"
  let tableID = table.toLowerCase().slice(0, table.length - 1) + "ID"

  
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
    axios
      .post('http://localhost:5000/run-query', { query })
      .then((response) => {
        setResults(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

      axios
      .post('http://localhost:5000/run-query', { query:`SELECT column_name FROM information_schema.columns  WHERE table_name = '${table}' AND table_schema = 'public'`})
      .then((columns) => {
        setColumns(columns.data);
        console.log(columns.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  


  if (!results.length) {
    // If there is no data available yet, show a loading indicator or an empty state.
    return <p>Loading...</p>;
  }

  function deleteEntry(librarianID) {
    axios
      .post(api, {
        query: `DELETE FROM public."${table}" WHERE "${tableID}" = ${librarianID}`
      })
      .then((response) => {
        setResults(response.data);
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
    <button onClick={() => setShowModal(true)}>Create New Record</button>
      <CreateRecordModal
        show={showModal}
        handleClose={handleCloseModal}
        handleCreate={handleCreateRecord}
      ></CreateRecordModal>
    </div>
      </div>
     



   

    
   
    
  );
}

export default App;
