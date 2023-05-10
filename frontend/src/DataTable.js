import React from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
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
  } = props;

  function handleEdit(data) {
    if (selectedTable == "Publishers") {
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
            if (editData[mappedColumns[index]]["type"] == "date") {
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
          console.log("ERROR : ", error);
        });
    }
    if (selectedTable == "Readers") {
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

      vals.map((element, index) => {
        let placeholder = element;

        if (editData[dbColumns[index]]["type"] == "date") {
          placeholder = new Date(element).toISOString().slice(0, 10);
          editData[dbColumns[index]]["placeholder"] = placeholder;
        } else {
          editData[dbColumns[index]]["placeholder"] = placeholder;
        }
      });
      setEditData(editData);
      setShowEditModal(!showEditModal);
    }

    if (selectedTable == "Loans") {
      let dataWithIDs = resultsWithIDs.filter((el) => {
        return el[0] == data[0];
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
        Object.entries(obj).filter(([_, value]) => value !== undefined)
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
  }

  return (
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
              <td>
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
  );
}
export default DataTable;