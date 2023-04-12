import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import Table from "react-bootstrap/Table";
import CreateRecordModal from "./createRecord";
import { useNavigate } from "react-router-dom";

function Overview() {
  const navigate = useNavigate();
  // general variables
  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  console.log("LoginStatus", loginStatus);
  if (!loginStatus) {
    navigate("/Login");
  }
  const api = "http://localhost:5000/run-query";
  const [selectedTable, setSelectedTable] = useState(
    sessionStorage.getItem("table") || "Librarians"
  );
  let temp = selectedTable.slice(0, selectedTable.length - 1);
  temp = temp.toLowerCase();
  temp = temp + "ID";

  // state variables
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [datatypes, setDatatypes] = useState([]);
  const [bookIDs, setBookIDs] = useState([]);
  const [query, setQuery] = useState("");

  const [options, setOptions] = useState(["Librarians", "Authors"]);
  const [uniqueColumn, setUniqueColumn] = useState(temp);
  const [shouldRender, setShouldRender] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateBookIDs, setUpdateBookIDs] = useState(false);
  const [formData, setFormData] = useState({
    librarianID: { type: "number", required: true, placeholder: "123" },
    librarianName: { type: "text", required: true, placeholder: "" },
    librarianEmail: { type: "email", required: true, placeholder: "" },
    librarianPhone: { type: "text", required: false, placeholder: "" },
  });
  const [editData, setEditData] = useState({
    librarianID: { type: "number", required: true, placeholder: "123" },
    librarianName: { type: "text", required: true, placeholder: "" },
    librarianEmail: { type: "email", required: true, placeholder: "" },
    librarianPhone: { type: "text", required: false, placeholder: "" },
  });

  // react hooks

  useEffect(() => {
    let query = `SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
      `;

    axios
      .post("http://localhost:5000/run-query", {
        query,
      })
      .then((tables) => {
        setOptions(tables.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // get data from table
  useEffect(() => {
    if (selectedTable) {
      const newQuery = `SELECT * FROM "${selectedTable}"`;
      temp = selectedTable.slice(0, selectedTable.length - 1);
      temp = temp.toLowerCase();
      temp = temp + "ID";
      setUniqueColumn(temp);
      setQuery(newQuery);
      setShouldRender(!shouldRender);
    }
  }, [selectedTable, updateData]);

  // get columns from table
  useEffect(() => {
    if (query) {
      console.log("B");
      axios
        .post("http://localhost:5000/run-query", { query })
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .post("http://localhost:5000/run-query", {
          query: `SELECT column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'`,
        })
        .then((columns) => {
          setColumns(columns.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [query, shouldRender, selectedTable]);

  //get datatypes from table
  useEffect(() => {
    if (query) {
      console.log("B");
      axios
        .post("http://localhost:5000/run-query", { query })
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .post("http://localhost:5000/run-query", {
          query: `SELECT data_type, column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'`,
        })
        .then((datatypes) => {
          let datatypesData = datatypes.data;
          //setDatatypes(datatypes.data);

          for (let index = 0; index < datatypesData.length; index++) {
            let element = datatypesData[index];
            if (
              element[0].startsWith("character") ||
              element[0].startsWith("char")
            ) {
              datatypesData[index] = "text";
            }
            if (
              element[0].startsWith("big") ||
              element[0].startsWith("int") ||
              element[0].startsWith("small") ||
              element[0].startsWith("numeric")
            ) {
              datatypesData[index] = "number";
            }

            if (element[0].startsWith("date")) {
              datatypesData[index] = "date";
            }
            if (element[0].startsWith("bool")) {
              datatypesData[index] = "checked";
            }
            if (element[1].includes("mail")) {
              datatypesData[index] = "email";
            }
            if (element[1].includes("assword")) {
              datatypesData[index] = "password";
            }

            //bookID
            if (element[1] == "loanBookID") {
              datatypesData[index] = "checkbox";
            }
          }
          datatypes.data = datatypes.data; //.shift();
          console.log(datatypes.data);
          setDatatypes(datatypes.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [query, shouldRender, selectedTable]);

  useEffect(() => {
    const newFormData = {};
    columns.map(
      (column, index) =>
        (newFormData[column] = {
          type: datatypes[index],
          required: true,
          placeholder: "",
        })
    );
    setFormData(newFormData);
    setEditData(newFormData);
  }, [columns]);

  //fetch bookIDs
  useEffect(() => {
    if (bookIDs) {
      axios
        .post("http://localhost:5000/run-query", {
          query: `SELECT "bookID" FROM public."Books"`,
        })
        .then((bookIDs) => {
          setBookIDs(bookIDs.data);
          console.log("BookIDS", bookIDs.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [updateBookIDs]);

  // functions
  function changeTable() {
    const selectElement = document.getElementById("mySelect");
    const selectedValue =
      selectElement.options[selectElement.selectedIndex].value;
    sessionStorage.setItem("table", selectedValue);
    setSelectedTable(selectedValue);
  }

  function addEntry(data, rowID) {
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
        //setResults(response.data);
        console.log(response.data);
        sessionStorage.setItem(
          "updateData",
          !Boolean(JSON.parse(sessionStorage.getItem("updateData")))
        );
        console.log(sessionStorage.getItem("updateData"));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteEntry(rowID) {
    const tempTable = selectedTable;
    axios
      .post(api, {
        query: `DELETE FROM public."${selectedTable}" WHERE "${uniqueColumn}" = ${rowID}`,
      })
      .then((response) => {
        setUpdateData(!updateData);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function editEntry(data) {
    let valuesString = "SET ";
    let columnsString = "";
    let query = "SET ";
    let rowID = selectedTable.slice(0, selectedTable.length - 1);
    rowID = rowID.toLowerCase();
    rowID = rowID + "ID";

    let values = Object.entries(data).map(
      ([key, value]) => (query = query + `"${key}" = '${value.placeholder}',`)
    );
    //let columns = Object.entries(data).map(
    //  ([key, value]) => (columnsString = columnsString + `"${key}",`)
    //);
    console.log(Object.values(data)[0]["placeholder"]);
    axios
      .post(api, {
        query:
          `UPDATE public."${selectedTable}" ${query.slice(
            0,
            columnsString.length - 1
          )} ` + `WHERE "${rowID}" = ${Object.values(data)[0]["placeholder"]}`,
      })
      .then((response) => {
        //setResults(response.data);
        console.log(response.data);
        sessionStorage.setItem(
          "updateData",
          !Boolean(JSON.parse(sessionStorage.getItem("updateData")))
        );
        console.log(sessionStorage.getItem("updateData"));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // event handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: { ...formData[name], placeholder: value },
    });
  };
  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditData({
      ...editData,
      [name]: { ...editData[name], placeholder: value },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addEntry(formData);
    setUpdateData(!updateData);
    setShowModal(!showModal);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    editEntry(editData);
    console.log(editData);
    setUpdateData(!updateData);
    setShowEditModal(!showEditModal);
  };

  function handleEdit(data) {
    //setEditData(...data);
    let keys = Object.keys(editData);
    console.log("EDIT DATA", data);

    data.map(
      (element, index) => (editData[keys[index]]["placeholder"] = element)
    );

    setShowEditModal(!showEditModal);
    console.log("EditData", editData);

    //editEntry(data);
  }

  function handleCreate() {
    const newFormData = {};
    columns.map(
      (column, index) =>
        (newFormData[column] = {
          type: datatypes[index],
          required: true,
          placeholder: "",
        })
    );
    setFormData(newFormData);
    setShowModal(!showModal);
  }

  //if (!results.length) {
  // If there is no data available yet, show a loading indicator or an empty state.
  //  return <p>Loading...</p>;
  //}

  return (
    <div>
      <Table striped bordered hover className="table mx-auto">
        <thead>
          {columns.map((column) => (
            <th>{column[0]}</th>
          ))}

          <th className="col"></th>
        </thead>
        <tbody>
          {results.map((data) => (
            <tr>
              {data.map((entry) => (
                <td>{entry}</td>
              ))}
              <td>
                <button
                  className="w-100 btn btn-lg btn-primary"
                  onClick={() => deleteEntry(data[0])}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className="w-100 btn btn-lg btn-primary"
                  onClick={() => handleEdit(data)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <button onClick={() => handleCreate() /*setShowModal(!showModal)}>*/}>
          Create New Record
        </button>
        <Modal show={showModal} onHide={!showModal}>
          <Modal.Header>
            <Modal.Title>Create New Record</Modal.Title>
            <Button
              variant="secondary"
              aria-label="Close"
              onClick={() => handleCreate()} //setShowModal(!showModal)}
            >
              Close
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {Object.entries(formData).map(([key, value], index) => (
                <Form.Group controlId={`${String(key)}`}>
                  <Form.Label>{`${String(key)}`}</Form.Label>
                  {datatypes[index] != "checkbox" ? (
                    <Form.Control
                      type={datatypes[index]} //`${String(value.type)}`}
                      name={`${String(key)}`}
                      value={`${value.placeholder}`}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <Form.Select
                      name={key}
                      value={formData[key]["placeholder"]}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled selected>
                        Select an option
                      </option>
                      {bookIDs.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>
              ))}
              <Button type="submit">Create</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      <div>
        <Modal show={showEditModal} onHide={!showEditModal}>
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
                      value.type == "date" &&
                      !isNaN(new Date(value.placeholder))
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

export default Overview;
