import { useState, useEffect } from "react";
import { Modal, Form, Button, ModalBody } from "react-bootstrap";
import axios from "axios";
import Table from "react-bootstrap/Table";
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
    "categoryID",
    "zipID",
    "currencyID",
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
    sessionStorage.getItem("table")
  );

  //* State variables //
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [datatypes, setDatatypes] = useState([]);
  const [bookIDs, setBookIDs] = useState([]);
  const [bookISBNs, setBookISBNs] = useState([]);
  const [showSearchAuthorButton, setShowSearchAuthorButton] = useState(false);
  const [showSearchBookButton, setShowSearchBookButton] = useState(false);
  const [showSearchManagerButton, setShowSearchManagerButton] = useState(false);
  const [showConvertOrderIntoBookButton, setShowConvertOrderIntoBookButton] =
    useState();
  const [hidePublisherButton, setHidePublisherButton] = useState();
  const [uniqueColumn, setUniqueColumn] = useState();
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

  //* Callback function //
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
          formDataKey = "libraryOrderManagerLibrarianID";
        }

        if (
          updatedFormData[formDataKey] &&
          updatedFormData[formDataKey].hasOwnProperty("placeholder")
        ) {
          updatedFormData[formDataKey].placeholder = input[key].toString();
        }
      });
      setFormData(updatedFormData);
      setshowSearch(!showSearch);
      sessionStorage.setItem("showPublisher", "false");
    }
  };

  //* React Hooks

  // Main Hook: This hook is called whenever the selected table is changed or the data updates

  useEffect(() => {
    let temp = selectedTable.slice(0, selectedTable.length - 1);
    temp = temp.toLowerCase();
    temp = temp + "ID";
    setUniqueColumn(temp);
    console.log(selectedTable, "selectedTable");

    setHidePublisherButton(
      selectedTable == "Books" || selectedTable == "LibraryOrders"
        ? false
        : true
    );

    // set datatypes
    axios
      .post("http://localhost:5000/run-query", {
        query: `SELECT data_type, column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'`,
      })
      .then((datatypes) => {
        let datatypesData = datatypes.data[1];
        console.log("DATATYPES", datatypes);
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
          if (notFilledColumns.includes(element[1])) {
            datatypesData[index] = null;
          }
        }

        const filteredArr = datatypesData.filter((value) => value != null);
        setDatatypes(filteredArr);

        // set formData/editData
        datatypes = filteredArr;
        axios
          .post("http://localhost:5000/run-query", {
            query: sessionStorage.getItem("tableQuery"),
          })
          .then((results) => {
            setResults(results.data[1]);
            setColumns(results.data[0]);

            axios
              .post("http://localhost:5000/run-query", {
                query: sessionStorage.getItem("formQuery"),
              })
              .then((results) => {
                // set EditData/formData
                let cols = results.data[0];
                const newFormData = {};
                // columns without id row
                cols = cols.slice(1, cols.length);
                console.log("COLS", cols);
                let prefillDateColumns = [
                  "loanLoanDate",
                  "libraryOrderDateOrdered",
                ];
                cols.map((column, index) => {
                  let placeholder = "";
                  if (column == "loanReaderEmail") {
                    placeholder = sessionStorage.getItem("loginMail");
                  }
                  if (prefillDateColumns.includes(column)) {
                    placeholder = new Date().toISOString().slice(0, 10);
                  }
                  if (column == "loanRenewals") {
                    placeholder = 0;
                  }
                  if (column == "loanOverdue") {
                    placeholder = false;
                  }
                  if (column == "loanFine") {
                    placeholder = 0;
                  }
                  //prefill loanReaderID
                  if (column == "loanReaderID") {
                    placeholder = sessionStorage.getItem("readerID");
                  }
                  if (notFilledColumns.includes(column[0])) {
                  } else {
                    newFormData[column] = {
                      type: datatypes[index],
                      required: true,
                      placeholder: placeholder,
                    };
                  }
                });
                setFormData(newFormData);
                setEditData(newFormData);
              });
          })
          .catch((error) => {
            console.log("ERROR : ", error);
          });
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });

    // set visibility of buttons
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

    // update boookISBNs
    axios
      .post(api, {
        query: `SELECT "bookISBN" FROM public."Books"`,
      })
      .then((response) => {
        setBookISBNs(response.data[1].flat());
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }, [selectedTable, updateData]);

  useEffect(() => {
    axios
      .post(api, {
        query: `SELECT "bookISBN" FROM public."Books"`,
      })
      .then((response) => {
        setBookISBNs(response.data[1].flat());
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }, []);

  function addEntry(data) {
    let loanBookID;
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
    setUpdateData(!updateData);
    /*  
    // decrese bookAvailableAmount by 1
    if (selectedTable == "Loans") {
      loanBookID = data["loanBookID"].placeholder;
      let updateQuery = `UPDATE public."Books" SET "bookAvailableAmount"  = "bookAvailableAmount" -1, "bookAvailability" = CASE WHEN "bookAvailableAmount" - 1 > 0 THEN true ELSE false END WHERE "bookID" = ${loanBookID}`;
      axios
        .post(api, {
          query: `${updateQuery}`,
        })
        .then((response) => {})
        .catch((error) => {
          console.log("ERROR : ", error);
        });
    }
    setUpdateData(!updateData);
    setShowModal(!showModal);
    */
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
    console.log("EDIT ENTRY DATA", data);
    let columnsString = "";
    let query = "SET ";
    let rowID = selectedTable.slice(0, selectedTable.length - 1);
    rowID = rowID.toLowerCase();
    rowID = rowID + "ID";
    if (selectedTable == "LibraryOrders") {
      rowID = "libraryOrderID";
    }
    let keyValue = rowUniqueID;

    let arr = Object.entries(data);
    for (let index = 0; index < arr.length; index++) {
      const column = arr[index][0];
      console.log("COLUMN? ", column);
      const values = arr[index][1];
      const datatype = values.type;
      console.log(arr[index], column, values, datatype);
      let placeholder = values.placeholder;
      if (datatype == "password") {
        const password = values.placeholder;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        placeholder = hashedPassword;
      }
      if (datatype == "date") {
        console.log(placeholder);
        placeholder = new Date(placeholder).toISOString().slice(0, 10);
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
        setUpdateData(!updateData);
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
    console.log(formData);
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
    console.log("KEYS", keys);
    console.log("EDITDATA", editData);
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
  }

  function handleCreate() {
    setShowModal(!showModal);
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
  }

  function convertIntoBook(header, data) {
    console.log(bookISBNs);

    header = header.flat();
    let libraryOrderISBN = data[header.indexOf("libraryOrderISBN")];
    console.log("libraryOrderISBN", libraryOrderISBN);
    let libraryOrderAmount = data[header.indexOf("libraryOrderAmount")];
    if (bookISBNs.includes(libraryOrderISBN)) {
      if (
        window.confirm(
          "A book with this ISBN already exists. The order amount will be added to the existing book if you press confirm. Otherwise press cancel to abort the order."
        )
      ) {
        // book already exists, update bookAmount and bookAvilabilityAmount
        let query = `UPDATE public."Books" SET "bookAmount" = "bookAmount" + ${libraryOrderAmount}, "bookAvailableAmount" = "bookAvailableAmount" + ${libraryOrderAmount} WHERE "bookISBN" = '${libraryOrderISBN}'`;
        console.log("QUERY", query);
        axios
          .post(api, {
            query: `${query}`,
          })
          .then((response) => {
            setUpdateData(!updateData);
            let updateQuery = `UPDATE public."LibraryOrders" SET "libraryOrderStatusOrder" = 'done' WHERE "libraryOrderID" = '${data[0]}'`;
            // successfull insert -> now update libraryOrderStatusOrder to done
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
    } else {
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
        "libraryOrderManagerLibrarianID",
        "libraryOrderCurrencyID",
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
              insertData =
                insertData + `'${data[header.indexOf(oldColumn)]}', `;
              insertColumns = insertColumns + `"bookAvailableAmount", `;
              insertData =
                insertData + `'${data[header.indexOf(oldColumn)]}', `;
            } else {
              insertColumns = insertColumns + `"${column}", `;
              insertData =
                insertData + `'${data[header.indexOf(oldColumn)]}', `;
            }
          }
        }
      });
      insertQuery =
        insertQuery +
        insertColumns.slice(0, insertColumns.length - 2) +
        ") Values (";

      insertQuery =
        insertQuery + insertData.slice(0, insertData.length - 2) + ")";
      console.log(insertQuery);
      let updateQuery = `UPDATE public."LibraryOrders" SET "libraryOrderStatusOrder" = 'done' WHERE "libraryOrderID" = '${data[indexID]}'`;

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
  }

  return (
    <div>
      <Table striped bordered hover className="table mx-auto">
        <thead>
          {columns.map((column) => (
            <th>{column}</th>
          ))}

          <th className="col"></th>
        </thead>
        <tbody>
          {results.map((data) => (
            <tr>
              {data.map((entry) => (
                <td>{typeof entry == "boolean" ? entry.toString() : entry}</td>
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
                    disabled={data[9] == "done" ? true : false}
                    onClick={() => convertIntoBook(columns, data)}
                  >
                    {data[9] == "done"
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
