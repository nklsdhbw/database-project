//* import libraries *//
import React from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { Input } from "antd";

//* import images *//
import chapterOneLogo from "../img/logo.svg";
import penBlueIcon from "../img/pen_blue_icon.svg";
import deleteIcon from "../img/bin_red_icon.svg";
import plusGreenIcon from "../img/plus_green_icon.svg";
import convertIntoBookIcon from "../img/convert_into_book_2.svg";
import convertedIntoBookIcon from "../img/convert_into_book_1.svg";
import returnIcon from "../img/return.svg";
import alreadyReturnedIcon from "../img/already_returned.svg";

//* import css *//
import "../css/DataTable.css";
import "../css/NavigationMenue.css";
function DataTable(props) {
  const {
    columns,
    results,
    deleteEntry,
    showConvertOrderIntoBookButton,
    convertIntoBook,
    selectedTable,
    editData,
    api,
    setRowUniqueID,
    setShowEditModal,
    setEditData,
    showEditModal,
    resultsWithIDs,
    setUpdateData,
    updateData,
    showModal,
    setShowModal,
  } = props;

  let amountExtraTableHeaders = 0;

  if (sessionStorage.getItem("createRecordPermission") == "true") {
    if (sessionStorage.getItem("deleteRecordPermission") == "true") {
      amountExtraTableHeaders += 1;
      if (sessionStorage.getItem("hideEditButton") == "false") {
        amountExtraTableHeaders += 1;
      }
    } else {
      if (sessionStorage.getItem("hideEditButton") == "false") {
        amountExtraTableHeaders += 1;
      }
    }
  } else {
    if (sessionStorage.getItem("deleteRecordPermission") == "true") {
      amountExtraTableHeaders += 1;
      if (sessionStorage.getItem("hideEditButton") == "false") {
        amountExtraTableHeaders += 1;
      }
    } else {
      if (sessionStorage.getItem("hideEditButton") == "false") {
        amountExtraTableHeaders += 1;
      }
    }
  }

  if (selectedTable === "Books") {
    amountExtraTableHeaders += 1;
  }
  if (
    selectedTable === "Publishers" ||
    selectedTable === "Teams" ||
    selectedTable === "Books" ||
    sessionStorage.getItem("tableQuery") ===
      `SELECT * FROM "enrichedLibrarians"`
  ) {
    amountExtraTableHeaders -= 1;
  }
  if (
    selectedTable === "Loans" &&
    sessionStorage.getItem("role") === "Reader"
  ) {
    amountExtraTableHeaders += 1;
  }
  if (
    selectedTable == "LibraryOrders" &&
    sessionStorage.getItem("role") == "Employee"
  ) {
    amountExtraTableHeaders += 1;
  }

  let extraTableHeaders = [];
  for (let i = 0; i < amountExtraTableHeaders; i++) {
    extraTableHeaders.push(<th key={amountExtraTableHeaders}></th>);
  }
  sessionStorage.setItem("amountExtraTableHeaders", amountExtraTableHeaders);

  // Inside the DataTable component
  const [searchTerm, setSearchTerm] = useState("");
  const Search = Input.Search;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  function handleReturn(data) {
    axios
      .post(api, {
        query: `UPDATE "Loans" SET "loanStatus" = 'returned' WHERE "loanID" = ${data[0]}`,
      })
      .then((response) => {
        setUpdateData(!updateData);
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  }
  function handleCreate() {
    setShowModal(!showModal);
  }

  function handleEdit(data) {
    //setUpdateData(!updateData);
    if (selectedTable === "Publishers") {
      let mappedColumns = Object.keys(
        JSON.parse(sessionStorage.getItem("columnMapping"))
      );

      let keys = Object.keys(editData);
      // get columns that are needed for editData
      let zipCodeIndex = mappedColumns.indexOf("zipCode");
      let zipCityIndex = mappedColumns.indexOf("zipCity");

      // add missing columns
      //get zipID
      axios
        .post(api, {
          query: `SELECT "zipID" FROM "ZIPs" WHERE "zipCode" = '${data[zipCodeIndex]}'`,
        })
        .then((response) => {
          let zipID = response.data[1][0][0];
          console.log(zipID);
          setRowUniqueID(zipID);
          //delete zipCode from data
          delete mappedColumns[zipCodeIndex];
          delete data[zipCodeIndex];
          delete mappedColumns[zipCityIndex];
          delete data[zipCityIndex];
          //remove uniqueID from data
          delete mappedColumns[0];
          delete data[0];
          mappedColumns = mappedColumns.filter((el) => {
            return el != undefined;
          });
          data = data.filter((el) => {
            return el != undefined;
          });
          data.push(zipID);
          mappedColumns.push("publisherZipID");
          let dataWithoutRowUniqueID = data;
          keys = mappedColumns;

          dataWithoutRowUniqueID.map((element, index) => {
            let placeholder = element;
            console.log("COLUMN", mappedColumns[index], "value", element);
            console.log(mappedColumns[index]);
            if (editData[mappedColumns[index]]["type"] === "date") {
              placeholder = new Date(element).toISOString().slice(0, 10);
              console.log("DATE");
            } else {
              editData[keys[index]]["placeholder"] = placeholder;
            }
          });
          setShowEditModal(!showEditModal);
          setEditData(editData);
        })
        .catch((error) => {
          console.log("ERROR: ", error);
        });
    }
    if (selectedTable === "Librarians") {
      let dbColumns = [
        "librarianID",
        "librarianFirstName",
        "librarianLastName",
        "librarianEmail",
        "librarianPhone",
        "librarianBirthDate",
        "librarianPassword",
      ];
      let vals = data;
      setRowUniqueID(data[0]);
      vals = vals.splice(1);
      dbColumns = dbColumns.splice(1);
      console.log(editData);
      console.log(vals);
      console.log(dbColumns);
      vals.map((element, index) => {
        let placeholder = element;
        console.log(element, "ELEMENT");
        if (editData[dbColumns[index]]["type"] === "date") {
          placeholder = new Date(element).toISOString().slice(0, 10);
          editData[dbColumns[index]]["placeholder"] = placeholder;
        } else {
          editData[dbColumns[index]]["placeholder"] = placeholder;
        }
      });

      setEditData(editData);
      setShowEditModal(!showEditModal);
    }
    if (selectedTable === "Books") {
      let dbColumns = [
        "bookID",
        "bookAmount",
        "bookTitle",
        "bookAuthorID",
        "bookPublisherID",
        "bookCategoryID",
        "bookISBN",
        "bookPublicationDate",
        "bookAvailability",
        "bookAmount",
        "bookAvailableAmount",
      ];
      let vals = data;
      setRowUniqueID(data[0]);
      vals = vals.splice(1);
      dbColumns = dbColumns.splice(1);
      console.log(editData);
      console.log(vals);
      console.log(dbColumns);
      vals.map((element, index) => {
        let placeholder = element;
        console.log(element, "ELEMENT");
        if (editData[dbColumns[index]]["type"] === "date") {
          placeholder = new Date(element).toISOString().slice(0, 10);
          editData[dbColumns[index]]["placeholder"] = placeholder;
        } else {
          editData[dbColumns[index]]["placeholder"] = placeholder;
        }
      });

      setEditData(editData);
      setShowEditModal(!showEditModal);
    }
    if (selectedTable === "Readers") {
      let dbColumns = [
        "readerID",
        "readerFirstName",
        "readerLastName",
        "readerEmail",
        "readerPassword",
      ];
      let vals = data;
      setRowUniqueID(data[0]);
      vals = vals.splice(1);
      dbColumns = dbColumns.splice(1);
      console.log(editData);
      console.log(dbColumns);
      vals.map((element, index) => {
        let placeholder = element;

        if (editData[dbColumns[index]]["type"] === "date") {
          placeholder = new Date(element).toISOString().slice(0, 10);
          editData[dbColumns[index]]["placeholder"] = placeholder;
        } else {
          editData[dbColumns[index]]["placeholder"] = placeholder;
        }
      });
      setEditData(editData);
      setShowEditModal(!showEditModal);
    }

    if (selectedTable === "Loans") {
      let dataWithIDs = resultsWithIDs.filter((el) => {
        return el[0] === data[0];
      });
      let loanID = data[0];

      setRowUniqueID(loanID);
      console.log(dataWithIDs, "DATAWITHIDS");
      dataWithIDs = dataWithIDs.flat();
      console.log(resultsWithIDs);

      let newColumns = [
        "loanID",
        "bookTitle",
        "ISBN",
        "Author",
        "Publisher",
        "loanLoanDate",
        "loanDueDate",
        "loanReturnDate",
        "loanStatus",
        "User",
        "loanRenewals",
        "loanOverdue",
        "loanFine",
        "Currency",
        "loanBookID",
        "loanReaderID",
        "loanCurrencyID",
      ];
      let nodelete = [
        "loanOverdue",
        "loanFine",
        "loanLoanDate",
        "loanDueDate",
        "loanReturnDate",
        "loanStatus",
        "loanRenewals",
      ];
      let columnsWithoutIDS = newColumns.filter((el) => {
        return !el.endsWith("ID");
      });
      columnsWithoutIDS = columnsWithoutIDS.filter(
        (x) => !nodelete.includes(x)
      );
      console.log(columnsWithoutIDS, "COLUMNSWITHOUTIDS");

      let obj = Object.fromEntries(
        newColumns.map((key, index) => [key, dataWithIDs[index]])
      );
      console.log(obj);
      columnsWithoutIDS.forEach((element) => {
        delete obj[element];
      });

      let keys = Object.keys(editData);
      obj = Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value != undefined)
      );
      console.log(obj, "OBJ");
      let cols = Object.keys(obj);
      let vals = Object.values(obj);
      vals = vals.splice(1);
      cols = cols.splice(1);

      vals.map((element, index) => {
        let placeholder = element;

        if (editData[cols[index]]["type"] == "date") {
          placeholder = new Date(element).toISOString().slice(0, 10);
          editData[cols[index]]["placeholder"] = placeholder;
          console.log("DATE");
        } else {
          editData[cols[index]]["placeholder"] = placeholder;
        }
      });
      setEditData(editData);
      setShowEditModal(!showEditModal);
    }

    if (selectedTable == "LibraryOrders") {
      let dataWithIDs = resultsWithIDs.filter((el) => {
        return el[0] == data[0];
      });
      let loanID = data[0];

      setRowUniqueID(loanID);
      console.log(dataWithIDs, "DATAWITHIDS");
      dataWithIDs = dataWithIDs.flat();
      console.log(resultsWithIDs);

      let libraryOrderAll = resultsWithIDs.filter((el) => {
        return el[0] == loanID;
      });
      let libraryOrder = Array.from(libraryOrderAll[0]);

      console.log(libraryOrder, "LIBRARYORDER");
      let newColumns = Array.from(columns);
      newColumns.push("authorID", "currencyID", "librarianID");
      console.log(newColumns, "COLUMNSWITHOUTIDS");
      let deleteColumns = ["Author", "Currency", "Manager"];
      deleteColumns.map((element) => {
        delete libraryOrder[newColumns.indexOf(element)];
        delete newColumns[newColumns.indexOf(element)];
      });

      // Filter out any remaining undefined elements from both arrays
      newColumns = newColumns.filter((el) => el != undefined);
      libraryOrder = libraryOrder.filter((el) => {
        return el != undefined;
      });
      console.log(libraryOrder, newColumns);
      let test = [
        "libraryOrderID",
        "libraryOrderBookTitle",
        "libraryOrderISBN",
        "libraryOrderAmount",
        "libraryOrderCost",
        "libraryOrderDateOrdered",
        "libraryOrderDeliveryDate",
        "libraryOrderStatusOrder",
        "libraryOrderAuthorID",
        "libraryOrderCurrencyID",
        "libraryOrderManagerLibrarianID",
        "libraryOrderPublisherID",
      ];
      let keys = Object.keys(editData);
      let cols = test;
      let vals = libraryOrder;
      vals = vals.splice(1);
      cols = cols.splice(1);
      console.log(editData);
      vals.map((element, index) => {
        let placeholder = element;
        console.log(cols[index], editData[cols[index]]);
        if (editData[cols[index]]["type"] == "date") {
          placeholder = new Date(element).toISOString().slice(0, 10);
          editData[cols[index]]["placeholder"] = placeholder;
          console.log("DATE");
        } else {
          editData[cols[index]]["placeholder"] = placeholder;
          console.log(cols[index]);
        }
      });
      setEditData(editData);

      setShowEditModal(!showEditModal);
    }
  }

  return (
    <>
      <header>
        <div className="logo-container">
          <img src={chapterOneLogo} alt="ChapterOne Logo" />
        </div>
      </header>
      <Search
        onChange={handleSearch}
        placeholder="Search"
        enterButton
        style={{ position: "sticky", top: "0", left: "0" }}
      />
      <br /> <br />
      <Table striped bordered hover className="custom-table">
        <thead>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}

          {sessionStorage.getItem("createRecordPermission") === "true" ? (
            <th>
              <img
                src={plusGreenIcon}
                alt="Create New Record"
                onClick={() => handleCreate()}
                style={{ cursor: "pointer" }}
              ></img>
            </th>
          ) : (
            <></>
          )}

          <>{extraTableHeaders}</>
        </thead>
        <tbody>
          {results
            .filter((data) =>
              data.some(
                (entry) =>
                  entry &&
                  entry
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
            )
            .map((data, index) => (
              <tr key={index}>
                {data.map((entry, entryIndex) => (
                  <td key={entryIndex}>
                    {typeof entry === "boolean"
                      ? entry.toString()
                      : typeof entry === "string" &&
                        /^[\w]{3}, \d{2} [\w]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(
                          entry
                        )
                      ? new Date(entry).toLocaleDateString()
                      : typeof entry === "number"
                      ? entry
                      : entry}
                  </td>
                ))}
                {selectedTable === "Loans" ? (
                  <td>
                    {data[columns.indexOf("Status")] !== "returned" ? (
                      <button
                        hidden={selectedTable !== "Loans"}
                        className="w-100 btn btn-lg btn-primary"
                        onClick={() => handleReturn(data)}
                        disabled={
                          data[columns.indexOf("Status")] === "returned"
                        }
                        style={{
                          background: `url(${returnIcon}) no-repeat center`,

                          backgroundSize: "contain",
                          border: "none",
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                      ></button>
                    ) : (
                      <button
                        hidden={selectedTable !== "Loans"}
                        style={{
                          background: `url(${alreadyReturnedIcon}) no-repeat center`,
                          backgroundSize: "contain",
                          border: "none",
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                      ></button>
                    )}
                  </td>
                ) : (
                  <></>
                )}
                {showConvertOrderIntoBookButton &&
                  (data[columns.indexOf("Order status")] !== "done" ? (
                    <td>
                      <button
                        className="w-100 btn btn-lg btn-primary"
                        onClick={() => convertIntoBook(columns, data)}
                        style={{
                          background: `url(${convertIntoBookIcon}) no-repeat center`,
                          backgroundSize: "contain",
                          border: "none",
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                      ></button>
                    </td>
                  ) : (
                    <td>
                      <button
                        className="w-100 btn btn-lg btn-primary"
                        disabled={true}
                        style={{
                          background: `url(${convertedIntoBookIcon}) no-repeat center`,
                          backgroundSize: "contain",
                          border: "none",
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                      ></button>
                    </td>
                  ))}
                {sessionStorage.getItem("hideEditButton") === "true" ? (
                  <></>
                ) : (
                  <td>
                    {/* Verwende das Bild als interaktiven Button */}
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(data)}
                      disabled={data[columns.indexOf("Status")] === "returned"}
                      style={{
                        background: `url(${penBlueIcon}) no-repeat center`,
                        backgroundSize: "contain",
                        border: "none",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        marginTop: "5px",
                      }}
                    ></button>
                  </td>
                )}
                {sessionStorage.getItem("deleteRecordPermission") === "true" ? (
                  <td>
                    <div>
                      <button
                        onClick={() => deleteEntry(data[0])}
                        style={{
                          background: `url(${deleteIcon}) no-repeat center`,
                          backgroundSize: "contain",
                          border: "none",
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                      ></button>
                    </div>
                  </td>
                ) : (
                  <></>
                )}
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}

export default DataTable;
