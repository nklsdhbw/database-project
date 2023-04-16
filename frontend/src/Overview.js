import { useState, useEffect } from "react";
import { Modal, Form, Button, ModalBody } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import Table from "react-bootstrap/Table";
import CreateRecordModal from "./createRecord";
import { useNavigate } from "react-router-dom";
import TableSearch from "./TableSearch";
import bcrypt from "bcryptjs";

function Overview() {
  const notFilledColumns = [
    "loanID",
    "bookID",
    "authorID",
    "librarianID",
    "publisherID",
    "libraryOrderID",
    "readerID",
    "libraryOrderStatusOrder",
  ];
  const BUTTON_TABLES = ["Loans", "Books", "LibraryOrders"];
  const navigate = useNavigate();
  // general variables
  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  if (!loginStatus) {
    navigate("/Login");
  }
  const api = "http://localhost:5000/run-query";
  const [selectedTable, setSelectedTable] = useState(
    sessionStorage.getItem("table") || "Librarians"
  );
  //sessionStorage.setItem("searchTable", "Books");
  let temp = selectedTable.slice(0, selectedTable.length - 1);
  temp = temp.toLowerCase();
  temp = temp + "ID";

  // state variables
  const [results, setResults] = useState([]);
  const [results2, setResults2] = useState([]);
  const [columns, setColumns] = useState([]);
  const [datatypes, setDatatypes] = useState([]);
  const [bookIDs, setBookIDs] = useState([]);
  const [showButton, setShowButton] = useState(
    BUTTON_TABLES.includes(selectedTable) ? true : false
  );
  const [showSearchAuthorButton, setShowSearchAuthorButton] = useState(false);
  const [showSearchBookButton, setShowSearchBookButton] = useState(false);
  const [showSearchManagerButton, setShowSearchManagerButton] = useState(false);
  const [showConvertOrderIntoBookButton, setShowConvertOrderIntoBookButton] =
    useState();
  const [hidePublisherButton, setHidePublisherButton] = useState(
    selectedTable == "Books" || selectedTable == "LibraryOrders" ? false : true
  );

  const [query, setQuery] = useState("");

  const [options, setOptions] = useState(["Librarians", "Authors"]);
  const [uniqueColumn, setUniqueColumn] = useState(temp);
  const [shouldRender, setShouldRender] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setshowSearch] = useState(false);
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
  const [rowUniqueID, setRowUniqueID] = useState([]);

  // callback
  const callThisFromChildComponent = (data) => {
    console.log("Data from Child component:", data);
    if (data == "closePanel") {
      setshowSearch(!showSearch);
    } else {
      let input = data;
      const updatedFormData = { ...formData };
      Object.keys(input).forEach((key) => {
        let formDataKey = key;
        if (key == "bookID") {
          formDataKey = "loanBookID";
        }
        if (key == "authorID" && selectedTable == "Books") {
          formDataKey = "bookAuthorID";
        }
        if (key == "authorName") {
          formDataKey = "bookAuthor";
        }
        if (key == "publisherID" && selectedTable == "Books") {
          formDataKey = "bookPublisherID";
        }
        if (key == "publisherName") {
          formDataKey = "bookPublisherName";
        }

        if (key == "publisherID" && selectedTable == "LibraryOrders") {
          formDataKey = "libraryOrderPublisherID";
        }
        if (key == "authorID" && selectedTable == "LibraryOrders") {
          formDataKey = "libraryOrderAuthorID";
        }
        if (key == "managerID" && selectedTable == "LibraryOrders") {
          formDataKey = "libraryOrderManagerID";
        }

        if (
          updatedFormData[formDataKey] &&
          updatedFormData[formDataKey].hasOwnProperty("placeholder")
        ) {
          updatedFormData[formDataKey].placeholder = input[key].toString();
        }
      });
      console.log("Updated FormData : ", updatedFormData);
      setFormData(updatedFormData);
      setshowSearch(!showSearch);
      sessionStorage.setItem("showPublisher", "false");
    }
  };

  // react hooks

  // set datatypes for the first time
  useEffect(() => {
    if (query) {
      axios
        .post("http://localhost:5000/run-query", { query })
        .then((response) => {
          setResults(response.data);
          setResults2(response);
        })
        .catch((error) => {
          console.log("ERROR : ", error);
        });

      axios
        .post("http://localhost:5000/run-query", {
          query: `SELECT data_type, column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'`,
        })
        .then((datatypes) => {
          let datatypesData = datatypes.data;
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
            //if (element[1] == "loanBookID") {
            //  datatypesData[index] = "checkbox";
            //}
            //drop loanID
            if (notFilledColumns.includes(element[1])) {
              datatypesData[index] = null;
            }
          }

          const filteredArr = datatypesData.filter((value) => value != null);
          console.log("HTML DATATYPES : ", filteredArr);
          setDatatypes(filteredArr);
        })
        .catch((error) => {
          console.log("ERROR : ", error);
        });
    }
  }, []);

  //set formData/editData for the first time
  useEffect(() => {
    axios
      .post("http://localhost:5000/run-query", { query })
      .then((response) => {
        setResults(response.data);
        setResults2(response);
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });

    axios
      .post("http://localhost:5000/run-query", {
        query: `SELECT column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'`,
      })
      .then((columns) => {
        setColumns(columns.data);
        const newFormData = {};
        let newColumns = columns.data;
        newColumns.map((column, index) => {
          if (notFilledColumns.includes(column[0])) {
          } else {
            newFormData[column[0]] = {
              type: datatypes[index],
              required: true,
              placeholder: "",
            };
          }
        });
        setFormData(newFormData);
        console.log(newFormData);
        console.log(datatypes);
        setEditData(newFormData);
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }, [datatypes]);

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
        console.log("ERROR : ", error);
      });
  }, []);

  // get data from table
  useEffect(() => {
    if (selectedTable) {
      const newQuery = `SELECT * FROM "${selectedTable}"`;
      temp = selectedTable.slice(0, selectedTable.length - 1);
      //if (selectedTable=="LibraryOrders"){
      temp = temp.charAt(0).toLowerCase() + temp.substring(1);
      console.log("UNIQUE COLUMN", temp);

      //temp = temp.toLowerCase();
      temp = temp + "ID";
      setUniqueColumn(temp);
      setQuery(newQuery);
      setShouldRender(!shouldRender);
    }
  }, [selectedTable, updateData]);

  // get columns from table
  useEffect(() => {
    if (query) {
      axios
        .post("http://localhost:5000/run-query", { query })
        .then((response) => {
          setResults(response.data);
          setResults2(response);
        })
        .catch((error) => {
          console.log("ERROR : ", error);
        });

      axios
        .post("http://localhost:5000/run-query", {
          query: `SELECT column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'`,
        })
        .then((columns) => {
          setColumns(columns.data);
          const newFormData = {};
          let newColumns = columns.data;
          newColumns.map((column, index) => {
            if (notFilledColumns.includes(column[0])) {
            } else {
              newFormData[column[0]] = {
                type: datatypes[index],
                required: true,
                placeholder: "",
              };
            }
          });
          setFormData(newFormData);
        })
        .catch((error) => {
          console.log("ERROR : ", error);
        });
    }
  }, [query, shouldRender, selectedTable]);

  //get datatypes from table
  useEffect(() => {
    if (query) {
      axios
        .post("http://localhost:5000/run-query", { query })
        .then((response) => {
          setResults(response.data);
          setResults2(response);
        })
        .catch((error) => {
          console.log("ERROR : ", error);
        });

      axios
        .post("http://localhost:5000/run-query", {
          query: `SELECT data_type, column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'`,
        })
        .then((datatypes) => {
          let datatypesData = datatypes.data;
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
            //if (element[1] == "loanBookID") {
            //  datatypesData[index] = "checkbox";
            //}
            //drop loanID
            if (notFilledColumns.includes(element[1])) {
              datatypesData[index] = null;
            }
          }

          const filteredArr = datatypesData.filter((value) => value != null);
          console.log("HTML DATATYPES : ", filteredArr);
          setDatatypes(filteredArr);
        })
        .catch((error) => {
          console.log("ERROR : ", error);
        });
    }
  }, [query, shouldRender, selectedTable]);

  useEffect(() => {
    const newFormData = {};
    console.log("COLUMNS", columns);
    let cols = columns.slice(1, columns.length);
    let prefillDateColumns = ["loanLoanDate", "libraryOrderDateOrdered"];
    cols.map((column, index) => {
      let placeholder = "";
      if (column[0] == "loanReaderEmail") {
        placeholder = sessionStorage.getItem("loginMail");
      }
      if (prefillDateColumns.includes(column[0])) {
        placeholder = new Date().toISOString().slice(0, 10);
      }
      if (column[0] == "loanRenewals") {
        placeholder = 0;
      }
      if (column[0] == "loanOverdue") {
        placeholder = false;
      }
      if (column[0] == "loanFine") {
        placeholder = 0;
      }
      if (notFilledColumns.includes(column[0])) {
      } else {
        newFormData[column[0]] = {
          type: datatypes[index],
          required: true,
          placeholder: placeholder,
        };
      }
    });
    console.log("New FormData : ", newFormData);
    setFormData(newFormData);
    setEditData(newFormData);
  }, [columns]);

  useEffect(() => {
    console.log("test");
    setShowSearchAuthorButton(false);
    setShowSearchBookButton(false);
    setHidePublisherButton(true);
    setShowSearchManagerButton(false);
    if (selectedTable == "Books") {
      setShowSearchAuthorButton(true);
      setHidePublisherButton(false);
    }

    if (selectedTable == "Loans") {
      sessionStorage.setItem("searchTable", "Books");
      setShowSearchBookButton(true);
    }
    if (selectedTable == "LibraryOrders") {
      sessionStorage.setItem("searchTable", "Authors");
      setHidePublisherButton(false);
      setShowSearchBookButton(false);
      setShowSearchAuthorButton(true);
      setShowSearchManagerButton(true);
    }
    setShowConvertOrderIntoBookButton(
      selectedTable == "LibraryOrders" ? true : false
    );
  }, [selectedTable]);
  //fetch bookIDs
  useEffect(() => {
    if (bookIDs) {
      axios
        .post("http://localhost:5000/run-query", {
          query: `SELECT "bookID" FROM public."Books"`,
        })
        .then((bookIDs) => {
          setBookIDs(bookIDs.data);
        })
        .catch((error) => {
          console.log("ERROR : ", error);
        });
    }
  }, [updateBookIDs]);

  // functions
  function changeTable() {
    const selectElement = document.getElementById("mySelect");
    const selectedValue =
      selectElement.options[selectElement.selectedIndex].value;
    sessionStorage.setItem("table", selectedValue);
    console.log("SELECTED TABLE", selectedValue);
    /*
    if (BUTTON_TABLES.includes(selectedValue)) {
      if (showButton === true) {
      } else {
        setShowButton(true);
      }
    } else {
      setShowButton(false);
    }
    if (selectedValue == "Loans") {
      sessionStorage.setItem("searchTable", "Books");
    }
    if (selectedValue == "Books" || selectedValue == "LibraryOrders") {
      sessionStorage.setItem("searchTable", "Authors");
      setHidePublisherButton(false);
    } else {
      setHidePublisherButton(true);
    }
    */
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
        sessionStorage.setItem(
          "updateData",
          !Boolean(JSON.parse(sessionStorage.getItem("updateData")))
        );
      })
      .catch((error) => {
        console.log("ERROR : ", error);
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
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }
  async function editEntry(data) {
    let valuesString = "SET ";
    let columnsString = "";
    let query = "SET ";
    let rowID = selectedTable.slice(0, selectedTable.length - 1);
    rowID = rowID.toLowerCase();
    rowID = rowID + "ID";
    console.log(data);
    let keyValue = rowUniqueID;
    console.log("KEY VALUE", keyValue);

    /*let values = Object.entries(data).map(
      ([key, value]) => (query = query + `"${key}" = '${value.placeholder}',`)
    );
    */
    let arr = Object.entries(data);
    for (let index = 0; index < arr.length; index++) {
      const column = arr[index][0];
      const values = arr[index][1];
      const datatype = values.type;
      console.log(arr[index], column, values, datatype);
      let placeholder = values.placeholder;
      if (datatype == "password") {
        console.log("THIS DATA IS PASSWORD");
        const password = values.placeholder;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        placeholder = hashedPassword;
      }
      query = query + `"${column}" = '${placeholder}',`;
    }
    console.log(query);

    axios
      .post(api, {
        query:
          `UPDATE public."${selectedTable}" ${query.slice(
            0,
            columnsString.length - 1
          )} ` + `WHERE "${rowID}" = ${keyValue}`,
      })
      .then((response) => {
        console.log("SUCCESS");

        setUpdateData(!updateData);
        sessionStorage.setItem(
          "updateData",
          !Boolean(JSON.parse(sessionStorage.getItem("updateData")))
        );
      })
      .catch((error) => {});
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
    setUpdateData(!updateData);
    setShowEditModal(!showEditModal);
  };

  function handleEdit(data) {
    let keys = Object.keys(editData);
    console.log("handleEdit EDIT DAT", editData);
    setRowUniqueID(data[0]);
    let dataWithoutRowUniqueID = data.slice(1);

    dataWithoutRowUniqueID.map((element, index) => {
      let placeholder = element;
      console.log("COLUMN", keys[index], "value", element);
      if (keys[index]["type"] == "date") {
        placeholder = new Date(element).toISOString().slice(0, 10);
        console.log("DATE");
      } else {
        editData[keys[index]]["placeholder"] = placeholder;
      }
    });

    setShowEditModal(!showEditModal);
    setEditData(editData);
    console.log("EDIT DATA", editData);
  }

  function handleCreate() {
    console.log("ACTUAL", formData);
    const newFormData = {};
    /*
    columns.map(
      (column, index) =>
        (newFormData[column] = {
          type: datatypes[index],
          required: true,
          placeholder: "",
        })
    );
    setFormData(newFormData);
    */
    setShowModal(!showModal);
    //navigate("/Search");
  }

  function handlePublisher() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Publishers");
  }

  function handleBook() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Books");
  }
  function handleAuthor() {
    setshowSearch(!showSearch);
    sessionStorage.setItem("searchTable", "Authors");
  }

  function handleManager() {
    sessionStorage.setItem("searchTable", "Managers");
    setshowSearch(!showSearch);

    console.log("MANAGER");
  }

  function convertIntoBook(header, data) {
    let successfullInsert = true;
    console.log(data);
    header = header.flat();
    let indexID = 0;
    let insertQuery = 'INSERT INTO public."Books" (';
    let insertColumns = "";
    let insertData = "";
    let oldColumn;
    let notNeccessaryColumns = [
      "libraryOrderAuthor",
      "libraryOrderPublisher",
      "libraryOrderDateOrdered",
      "libraryOrderDeliveryDate",
      "libraryOrderCost",
      "libraryOrderStatusOrder",
      "libraryOrderManagerID",
    ];
    header.forEach((column) => {
      if (
        notFilledColumns.includes(column) &&
        column != "libraryOrderStatusOrder"
      ) {
        indexID = header.indexOf(column);
      } else {
        if (notNeccessaryColumns.includes(column)) {
        } else {
          switch (column) {
            case "libraryOrderBookTitle":
              oldColumn = column;
              column = "bookTitle";
              break;
            case "libraryOrderAuthorID":
              oldColumn = column;
              column = "bookAuthorID";
              break;
            case "libraryOrderAmount":
              oldColumn = column;
              column = "bookAmount";
              break;
            case "libraryOrderISBN":
              oldColumn = column;
              column = "bookISBN";
              break;
            case "libraryOrderPublisherID":
              oldColumn = column;
              column = "bookPublisherID";
              break;
            default:
              break;
          }
          if (column == "bookAmount") {
            insertColumns = insertColumns + `"${column}", `;
            insertData = insertData + `'${data[header.indexOf(oldColumn)]}', `;
            insertColumns = insertColumns + `"bookAvailabilityAmount", `;
            insertData = insertData + `'${data[header.indexOf(oldColumn)]}', `;
          } else {
            insertColumns = insertColumns + `"${column}", `;
            insertData = insertData + `'${data[header.indexOf(oldColumn)]}', `;
          }
        }
      }
    });
    insertQuery =
      insertQuery +
      insertColumns.slice(0, insertColumns.length - 2) +
      ") Values (";
    console.log(insertQuery);

    insertQuery =
      insertQuery + insertData.slice(0, insertData.length - 2) + ")";
    console.log(insertQuery);

    let updateQuery = `UPDATE public."LibraryOrders" SET "libraryOrderStatusOrder" = 'done' WHERE "libraryOrderID" = '${data[indexID]}'`;
    console.log(updateQuery);

    axios
      .post(api, {
        query: `${insertQuery}`,
      })
      .then((response) => {
        setUpdateData(!updateData);
        // successfull insert -> now update exsting Data
        axios
          .post(api, {
            query: `${updateQuery}`,
          })
          .then((response) => {
            setUpdateData(!updateData);
          })
          .catch((error) => {
            console.log("ERROR : ", error);
          });
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
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
                <Button
                  className="w-100 btn btn-lg btn-primary"
                  onClick={() => handleEdit(data)}
                >
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  className="w-100 btn btn-lg btn-primary"
                  onClick={() => deleteEntry(data[0])}
                >
                  Delete
                </Button>
              </td>

              {showConvertOrderIntoBookButton ? (
                <td>
                  <Button
                    disabled={data[data.length - 2] == "done" ? true : false}
                    onClick={() => convertIntoBook(columns, data)}
                  >
                    {data[data.length - 2] == "done"
                      ? "Already converted"
                      : "Convert into Book"}
                  </Button>
                </td>
              ) : (
                <></>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <button onClick={() => handleCreate() /*setShowModal(!showModal)}>*/}>
          Create New Record
        </button>

        <Modal show={showModal}>
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

                  <Form.Control
                    name={key}
                    value={formData[key]["placeholder"]}
                    onChange={handleInputChange}
                    required
                    type={datatypes[index]}
                  ></Form.Control>
                </Form.Group>
              ))}
              <Button type="submit">Create</Button>
              {showSearchBookButton ? (
                <Button onClick={() => handleBook()}>Search Book</Button>
              ) : (
                <></>
              )}
              {showSearchAuthorButton ? (
                <Button onClick={() => handleAuthor()}>Search Author</Button>
              ) : (
                <></>
              )}
              {showSearchManagerButton ? (
                <Button onClick={() => handleManager()}>Search Manager</Button>
              ) : (
                <></>
              )}
              <Button
                hidden={hidePublisherButton}
                onClick={() => handlePublisher()}
              >
                Search Publisher
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      <div>
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
      <div>
        {showSearch && (
          <Modal show={showSearch} fullscreen={true}>
            <ModalBody>
              <TableSearch
                id="Search"
                callback={callThisFromChildComponent}
              ></TableSearch>
            </ModalBody>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Overview;
