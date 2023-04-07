import { useState, useEffect } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import Table from 'react-bootstrap/Table';

function App() {
  const api = "http://localhost:5000/run-query"
  const [results, setResults] = useState([]);
  const query = 'SELECT * FROM public."Librarians"';

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
  }, []);

  if (!results.length) {
    // If there is no data available yet, show a loading indicator or an empty state.
    return <p>Loading...</p>;
  }

  function deleteEntry(librarianID) {
    axios
      .post(api, {
        query: `DELETE FROM public."Librarians" WHERE "librarianID" = ${librarianID}`
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
    <Table striped bordered hover className="table mx-auto">
      <thead>
        <tr>
          <th className="col">ID</th>
          <th className="col">Fullname</th>
          <th className="col">Email</th>
          <th className="col">Phone</th>
          <th className="col"></th>
        </tr>
      </thead>
      <tbody>
        {results.map((entry) => (
          <tr >
            <td>{entry[0]}</td>
            <td>{entry[1]}</td>
            <td>{entry[2]}</td>
            <td>{entry[3]}</td>
            <td>
              <button className="w-100 btn btn-lg btn-primary" onClick={() => deleteEntry(entry[0])}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default App;
