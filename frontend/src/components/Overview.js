import { useState, useEffect } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

//* import components *//
import TableSearch from "./TableSearch";
import DataTable from "./DataTable.js";
import CreateRecordModal from "./CreateRecordModal";
import EditRecordModal from "./EditRecordModal";
import Filterpanel from "./Filterpanel";
import Header from "./Header";

//* import required images *//
import backIcon from "../img/back.svg";

function Overview() {
  const navigate = useNavigate();
  // general variables
  const notFilledColumns = [
    "loanID",
    "bookID",
    "authorID",
    "librarianID",
    "publisherID",
    "libraryOrderID",
    "readerID",
    "categoryID",
    "zipID",
    "currencyID",
  ];
  let loginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  const api = "http://localhost:8000/run-query";
  if (!loginStatus) {
    navigate("/Login");
  }

  // spinner properties
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
    marginTop: "10%",
  };

  //* State variables //
  const [selectedTable, setSelectedTable] = useState(
    sessionStorage.getItem("table")
  );
  const [results, setResults] = useState([]);
  const [resultsWithIDs, setResultsWithIDs] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnsWithIDs, setColumnsWithIDs] = useState([]);
  const [datatypes, setDatatypes] = useState([]);
  const [bookISBNs, setBookISBNs] = useState([]);
  const [showSearchAuthorButton, setShowSearchAuthorButton] = useState(false);
  const [showSearchBookButton, setShowSearchBookButton] = useState(false);
  const [showSearchManagerButton, setShowSearchManagerButton] = useState(false);
  const [showSearchZipButton, setShowSearchZipButton] = useState(false);
  const [showSearchTeamButton, setShowSearchTeamButton] = useState(false);
  const [showSearchEmployeeButton, setShowSearchEmployeeButton] =
    useState(false);
  const [showSearchCurrencyButton, setShowSearchCurrencyButton] =
    useState(false);
  const [showSearchReaderButton, setShowSearchReaderButton] = useState(false);
  const [showConvertOrderIntoBookButton, setShowConvertOrderIntoBookButton] =
    useState();
  const [hidePublisherButton, setHidePublisherButton] = useState();
  const [uniqueColumn, setUniqueColumn] = useState();
  const [updateData, setUpdateData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setshowSearch] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
  const amountIDColumns = {
    Loans: 3,
    Publishers: 0,
    LibraryOrders: 4,
    Readers: 0,
    Librarians: 0,
    Teams: 0,
    Books: 0,
    Employees: 0,
    Managers: 0,
  };
  const [isLoading, setIsLoading] = useState();

  //* Callback function //
  const callThisFromChildComponent = (data) => {
    console.log("Data from Child component:", data);
    if (data === "closePanel") {
      setshowSearch(!showSearch);
    } else {
      let input = data;
      const updatedFormData = { ...formData };
      Object.keys(input).forEach((key) => {
        let formDataKey = key;
        if (key === "bookID") {
          formDataKey = "loanBookID";
        }
        if (key === "authorID" && selectedTable === "Books") {
          formDataKey = "bookAuthorID";
        }
        if (key === "authorName") {
          formDataKey = "bookAuthor";
        }
        if (key === "publisherID" && selectedTable === "Books") {
          formDataKey = "bookPublisherID";
        }
        if (key === "publisherName") {
          formDataKey = "bookPublisherName";
        }
        if (key === "publisherID" && selectedTable === "LibraryOrders") {
          formDataKey = "libraryOrderPublisherID";
        }
        if (key === "authorID" && selectedTable === "LibraryOrders") {
          formDataKey = "libraryOrderAuthorID";
        }
        if (key === "managerID" && selectedTable === "LibraryOrders") {
          formDataKey = "libraryOrderManagerLibrarianID";
        }
        if (key === "zipID" && selectedTable === "Publishers") {
          formDataKey = "publisherZipID";
        }
        if (key === "currencyID" && selectedTable === "Loans") {
          formDataKey = "loanCurrencyID";
        }
        if (key === "currencyID" && selectedTable === "LibraryOrders") {
          formDataKey = "libraryOrderCurrencyID";
        }
        if (key === "currencyID" && selectedTable === "LibraryOrders") {
          formDataKey = "libraryOrderCurrencyID";
        }

        if (
          key === "librarianID" &&
          sessionStorage.getItem("searchTable") === "Employees"
        ) {
          formDataKey = "employeeLibrarianID";
        }
        if (
          key === "teamID" &&
          sessionStorage.getItem("searchTable") === "Teams"
        ) {
          formDataKey = "employeeTeamID";
        }
        if (
          key === "readerID" &&
          sessionStorage.getItem("searchTable") === "Readers"
        ) {
          formDataKey = "loanReaderID";
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
    }
  };

  //* React Hooks

  // Main Hook: This hook is called whenever the selected table is changed or the data updates

  useEffect(() => {
    setIsLoading(true);
    let uniqueColumn = selectedTable.slice(0, selectedTable.length - 1);
    uniqueColumn = uniqueColumn.toLowerCase();
    uniqueColumn = uniqueColumn + "ID"; //e.g. loanID
    if (selectedTable === "LibraryOrders") {
      uniqueColumn = "libraryOrderID";
    }
    setUniqueColumn(uniqueColumn);
    console.log(selectedTable, "selectedTable");

    // set datatypes
    getDatatypes();

    // set visibility of buttons
    setButtonVisabilities();

    // update boookISBNs
    getISBNs();
  }, [selectedTable, updateData]);

  useEffect(() => {
    getISBNs();
  }, []);

  function deleteEntry(rowID) {
    if (selectedTable === "Teams") {
      axios
        .post(api, {
          query: `UPDATE public."Employees" SET "employeeTeamID" = NULL WHERE "employeeLibrarianID" = ${rowID}`,
        })
        .then((response) => {
          setUpdateData(!updateData);
        })
        .catch((error) => {
          console.log("ERROR : ", error);
        });
    } else {
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
  }

  function convertIntoBook(header, data) {
    data = data.flat();
    header = header.flat();
    header.push(["Author ID", "Currency ID", "Librarian ID", "Publisher ID"]);
    header = header.flat();
    let libraryOrderISBN = data[header.indexOf("ISBN")];
    let libraryOrderAmount = data[header.indexOf("Order amount")];
    let libraryOrderID = data[0];
    header = header.slice(1);
    data = data.slice(1);

    if (bookISBNs.includes(libraryOrderISBN)) {
      if (
        window.confirm(
          "A book with this ISBN already exists. The order amount will be added to the existing book if you press confirm. Otherwise press cancel to abort the order."
        )
      ) {
        // book already exists, update bookAmount and bookAvilabilityAmount
        let query = `UPDATE public."Books" SET "bookAmount" = "bookAmount" + ${libraryOrderAmount}, "bookAvailableAmount" = "bookAvailableAmount" + ${libraryOrderAmount} WHERE "bookISBN" = '${libraryOrderISBN}'`;
        axios
          .post(api, {
            query: `${query}`,
          })
          .then((response) => {
            setUpdateData(!updateData);
            let updateQuery = `UPDATE public."LibraryOrders" SET "libraryOrderStatusOrder" = 'done' WHERE "libraryOrderID" = '${libraryOrderID}'`;
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
      let parameters = [];
      let notNeccessaryColumns = [
        "Author",
        "Publisher",
        "Order date",
        "Delivery Date",
        "Cost",
        "Manager",
        "Currency",
        "Order status",
        "Currency ID",
        "Librarian ID",
      ];
      header.push("bookAvailability");

      header.forEach((column) => {
        if (notFilledColumns.includes(column) && column !== "Order status") {
          indexID = header.indexOf(column);
        } else {
          if (notNeccessaryColumns.includes(column)) {
          } else {
            switch (column) {
              case "Book title":
                oldColumn = column;
                column = "bookTitle";
                break;
              case "Author ID":
                oldColumn = column;
                column = "bookAuthorID";
                break;
              case "Order amount":
                oldColumn = column;
                column = "bookAmount";
                break;
              case "ISBN":
                oldColumn = column;
                column = "bookISBN";
                break;
              case "Publisher ID":
                oldColumn = column;
                column = "bookPublisherID";
                break;
              default:
                break;
            }
            if (column === "bookAmount") {
              insertColumns = insertColumns + `"${column}", `;
              insertData = insertData + `%s, `;
              parameters.push(data[header.indexOf(oldColumn)]);
              insertColumns = insertColumns + `"bookAvailableAmount", `;
              insertData = insertData + `%s, `;
              parameters.push(data[header.indexOf(oldColumn)]);
            } else if (column === "bookAvailability") {
              insertColumns = insertColumns + `"${column}", `;
              insertData = true + `%s, `;
              parameters.push(true);
            } else {
              insertColumns = insertColumns + `"${column}", `;
              insertData = insertData + `%s, `;
              parameters.push(data[header.indexOf(oldColumn)]);
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
      let updateParameters = [libraryOrderID];
      let updateQuery = `UPDATE public."LibraryOrders" SET "libraryOrderStatusOrder" = 'done' WHERE "libraryOrderID" = %s`;

      axios
        .post(api, {
          query: `${insertQuery}`,
          parameters: parameters,
        })
        .then((response) => {
          setUpdateData(!updateData);
          // successfull insert -> now update exsting Data
          axios
            .post(api, {
              query: `${updateQuery}`,
              parameters: updateParameters,
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

  function handleCreate() {
    setShowModal(!showModal);
  }

  function getDatatypes() {
    axios
      .post(api, {
        query: `SELECT data_type, column_name FROM information_schema.columns  WHERE table_name = '${selectedTable}' AND table_schema = 'public'`,
      })
      .then((datatypes) => {
        let datatypesData = datatypes.data[1];
        console.log("DATATYPES", datatypes);
        for (let index = 0; index < datatypesData.length; index++) {
          let element = datatypesData[index];
          let type = element[0];
          let columnName = element[1];

          if (type.startsWith("character") || type.startsWith("char")) {
            datatypesData[index] = "text";
            console.log(columnName);
          }
          if (
            type.startsWith("big") ||
            type.startsWith("int") ||
            type.startsWith("small") ||
            type.startsWith("numeric")
          ) {
            datatypesData[index] = "number";
          }
          if (type.startsWith("date")) {
            datatypesData[index] = "date";
          }
          if (type.startsWith("bool")) {
            datatypesData[index] = "checked";
          }
          if (columnName.includes("mail")) {
            datatypesData[index] = "email";
          }
          if (columnName.includes("assword")) {
            datatypesData[index] = "password";
          }
          if (notFilledColumns.includes(columnName)) {
            datatypesData[index] = null;
          }
        }

        const filteredArr = datatypesData.filter((value) => value != null);
        setDatatypes(filteredArr);
        setFormAndEditData(filteredArr);
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }

  function getISBNs() {
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
  }

  function setButtonVisabilities() {
    setHidePublisherButton(
      selectedTable === "Books" || selectedTable === "LibraryOrders"
        ? false
        : true
    );
    setShowSearchAuthorButton(false);
    setShowSearchBookButton(false);
    setHidePublisherButton(true);
    setShowSearchManagerButton(false);
    setShowSearchZipButton(false);
    setShowSearchTeamButton(false);
    setShowSearchCurrencyButton(false);
    setShowSearchEmployeeButton(false);
    setShowSearchReaderButton(false);
    if (selectedTable === "Books") {
      setShowSearchAuthorButton(true);
      setHidePublisherButton(false);
    }

    if (selectedTable === "Loans") {
      sessionStorage.setItem("searchTable", "Books");
      setShowSearchBookButton(true);
      setShowSearchCurrencyButton(true);
      setShowSearchReaderButton(true);
    }
    if (selectedTable === "LibraryOrders") {
      sessionStorage.setItem("searchTable", "Authors");
      setHidePublisherButton(false);
      setShowSearchBookButton(false);
      setShowSearchAuthorButton(true);
      setShowSearchManagerButton(true);
      setShowSearchCurrencyButton(true);
    }
    if (selectedTable === "Publishers") {
      setShowSearchZipButton(true);
    }
    if (selectedTable === "Teams") {
      setShowSearchTeamButton(true);
      setShowSearchEmployeeButton(true);
    }
    if (selectedTable === "Librarians") {
      setShowSearchTeamButton(true);
    }
    setShowConvertOrderIntoBookButton(
      selectedTable === "LibraryOrders" ? true : false
    );
  }

  function setFormAndEditData(datatypes) {
    console.log(sessionStorage.getItem("tableQuery"));
    axios
      .post(api, {
        query: sessionStorage.getItem("tableQuery"),
      })
      .then((results) => {
        setResultsWithIDs(results.data[1]);
        let resultsWithoutIDs = Array.from(results.data[1]);
        resultsWithoutIDs.forEach((element, index) => {
          resultsWithoutIDs[index] = element.slice(
            0,
            element.length - amountIDColumns[selectedTable]
          );
        });
        setResults(resultsWithoutIDs);
        let columnswithoutID = results.data[0];
        columnswithoutID = columnswithoutID.slice(
          0,
          columnswithoutID.length - amountIDColumns[selectedTable]
        );
        setColumnsWithIDs(results.data[0]);
        setColumns(columnswithoutID);

        axios
          .post(api, {
            query: sessionStorage.getItem("formQuery"),
          })
          .then((results) => {
            // set EditData/formData
            let cols = results.data[0];
            const newFormData = {};
            // columns without id row
            cols = cols.slice(1, cols.length);

            let prefillDateColumns = [
              "loanLoanDate",
              "libraryOrderDateOrdered",
            ];
            cols.map((column, index) => {
              let placeholder = "";
              if (column === "loanReaderEmail") {
                placeholder = sessionStorage.getItem("loginMail");
              }
              if (prefillDateColumns.includes(column)) {
                placeholder = new Date().toISOString().slice(0, 10);
              }
              if (column === "loanRenewals") {
                placeholder = 0;
              }
              if (column === "loanOverdue") {
                placeholder = false;
              }
              if (column === "loanFine") {
                placeholder = 0;
              }
              if (column === "loanStatus") {
                placeholder = "open";
              }
              //prefill loanReaderID
              if (column === "loanReaderID") {
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

            if (selectedTable === "Teams") {
              let teamsFormData = {
                employeeTeamID: {
                  type: "number",
                  required: true,
                  placeholder: undefined,
                },
                employeeLibrarianID: {
                  type: "number",
                  required: true,
                  placeholder: undefined,
                },
              };
              setFormData(teamsFormData);
              setEditData(teamsFormData);
              setDatatypes(["number", "number"]);
            } else if (selectedTable === "Librarians") {
              newFormData["employeeTeamID"] = {
                type: "number",
                required: true,
                placeholder: undefined,
              };
              newFormData["Role"] = {
                type: "option",
                required: true,
                placeholder: undefined,
              };

              setFormData(newFormData);
              setEditData(newFormData);
              let tempDatatypes = Array.from(datatypes);
              tempDatatypes.push("number", "option");
              setDatatypes(tempDatatypes);
            } else {
              setFormData(newFormData);
              setEditData(newFormData);
            }
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }

  return (
    <div>
      <Header />
      <div>
        <button
          title="Back to Navigation"
          style={{
            background: `url(${backIcon}) no-repeat center`,
            backgroundSize: "contain",
            border: "none",
            width: "50px",
            height: "50px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/NavigationMenue")}
        ></button>
      </div>
      <br></br>
      <Filterpanel
        columns={columns}
        results={results}
        setUpdateData={setUpdateData}
        updateData={updateData}
      />
      <br></br>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <ClipLoader css={override} size={150} color={"blue"} loading={true} />
          <span style={{ marginTop: "0.5rem" }}>Loading...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          results={results}
          deleteEntry={deleteEntry}
          showConvertOrderIntoBookButton={showConvertOrderIntoBookButton}
          convertIntoBook={convertIntoBook}
          selectedTable={selectedTable}
          editData={editData}
          api={api}
          setRowUniqueID={setRowUniqueID}
          setShowEditModal={setShowEditModal}
          setEditData={setEditData}
          showEditModal={showEditModal}
          resultsWithIDs={resultsWithIDs}
          updateData={updateData}
          setUpdateData={setUpdateData}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      <div>
        <CreateRecordModal
          showModal={showModal}
          handleCreate={handleCreate}
          formData={formData}
          datatypes={datatypes}
          showSearchBookButton={showSearchBookButton}
          showSearchAuthorButton={showSearchAuthorButton}
          showSearchManagerButton={showSearchManagerButton}
          hidePublisherButton={hidePublisherButton}
          showSearchZipButton={showSearchZipButton}
          showSearchTeamButton={showSearchTeamButton}
          showSearchEmployeeButton={showSearchEmployeeButton}
          showSearchCurrencyButton={showSearchCurrencyButton}
          showSearchReaderButton={showSearchReaderButton}
          setShowModal={setShowModal}
          setFormData={setFormData}
          setUpdateData={setUpdateData}
          updateData={updateData}
          setshowSearch={setshowSearch}
          showSearch={showSearch}
          api={api}
          selectedTable={selectedTable}
        />
      </div>
      <div>
        <EditRecordModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          updateData={updateData}
          setUpdateData={setUpdateData}
          editData={editData}
          datatypes={datatypes}
          setEditData={setEditData}
          columns={columns}
          selectedTable={selectedTable}
          api={api}
          rowUniqueID={rowUniqueID}
          showSearchBookButton={showSearchBookButton}
          showSearchAuthorButton={showSearchAuthorButton}
          showSearchManagerButton={showSearchManagerButton}
          hidePublisherButton={hidePublisherButton}
          showSearchZipButton={showSearchZipButton}
          showSearchCurrencyButton={showSearchCurrencyButton}
          showSearchReaderButton={showSearchReaderButton}
          showSearchTeamButton={showSearchTeamButton}
          setshowSearch={setshowSearch}
          showSearch={showSearch}
        />
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
