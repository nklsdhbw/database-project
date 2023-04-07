import { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleRunQuery = () => {
    console.log(query)
    axios.post('http://localhost:5000/run-query', { query })
      .then(response => {
        setResults(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleRunQuery}>Run Query</button>
    </div>
  );
}
export default App