import { useState, useEffect } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import Table from 'react-bootstrap/Table';

function App() {
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

  const columns = [
    { dataField: 'id', text: 'ID' },
    { dataField: 'name', text: 'Name' },
    { dataField: 'email', text: 'Email' },
    { dataField: 'phone', text: 'Phone' },
  ];

  return (
    <Table striped bordered hover className="table mx-auto">
      <thead>
        <tr>
          <th className="col">Gegenstand</th>
          <th className="col">Menge</th>
          <th className="col"></th>
        </tr>
      </thead>
      <tbody>
        {results.map((entry) => (
          <tr >
            <td>{entry[0]}</td>
            <td>{entry[1]}</td>
            <td>
              <button className="w-100 btn btn-lg btn-primary">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default App;
