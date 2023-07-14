import React, { useState } from "react";
import { Input } from "antd";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useTableSearch } from "./useTableSearch";
import { Button } from "react-bootstrap";

const { Search } = Input;

const fetchUsers = async () => {
  let inputColumns;
  let data;
  let table = sessionStorage.getItem("searchTable");
  let dataQuery = `SELECT * FROM public."${table}"`;
  if (table === "Employees") {
    dataQuery = `SELECT 
    "librarianID", 
    "librarianFirstName", 
    "librarianLastName", 
    "librarianEmail", 
    "librarianPhone", 
    "librarianBirthDate"
     FROM public."Librarians" 
    JOIN "Employees" ON "employeeLibrarianID" = "librarianID"
    WHERE "employeeTeamID" IS NULL`;
  }

  await axios
    .post("http://localhost:5010/run-query", {
      query: dataQuery,
    })
    .then((response) => {
      inputColumns = response.data[0];
      console.log(response.data);
      let data2 = response.data[1];
      console.log(data2);
      console.log(typeof data2);
      let entries = Object.values(data2);
      console.log("Entries", entries, typeof entries);
      console.log("Keys", Object.keys(data2));
      console.log(typeof inputColumns, inputColumns.length);
      let array = inputColumns;
      const result = data2.map((data) => {
        let obj = {};
        array.forEach((key, index) => {
          obj[key] = data[index];
        });
        return obj;
      });

      data = result;
      return { result };
    })
    .catch((error) => {
      console.log(error);
    });
  return { data };
};

export default function TableSearch({ callback }) {
  const [searchVal, setSearchVal] = useState(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers,
  });

  return (
    <>
      <Button onClick={() => callback("closePanel")}>Close</Button>
      <br /> <br />
      <Search
        onChange={(e) => setSearchVal(e.target.value)}
        placeholder="Search"
        enterButton
        style={{ position: "sticky", top: "0", left: "0" }}
      />
      <br /> <br />
      {
        <div>
          <Table striped bordered hover className="table mx-auto">
            <thead>
              {filteredData
                .slice(0, 1)
                .map((column) =>
                  Object.keys(column).map((col) => <th key={col}>{col}</th>)
                )}
              <th className="col"></th>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).map(([key, value]) => (
                    <td key={key}>
                      <div>
                        <div>
                          {typeof value === "boolean"
                            ? value.toString()
                            : value}
                        </div>
                      </div>
                    </td>
                  ))}
                  <td>
                    <button
                      className="w-100 btn btn-lg btn-primary"
                      onClick={() => callback(row)}
                      disabled={
                        sessionStorage.getItem("searchTable") === "Books" &&
                        row["bookAvailableAmount"] > 0
                          ? false
                          : true
                      }
                      hidden={
                        !(sessionStorage.getItem("searchTable") === "Books")
                      }
                    >
                      {sessionStorage.getItem("searchTable") === "Books" &&
                      row["bookAvailableAmount"] > 0
                        ? "Choose"
                        : "Not available"}
                    </button>
                    <button
                      className="w-100 btn btn-lg btn-primary"
                      onClick={() => callback(row)}
                      hidden={sessionStorage.getItem("searchTable") === "Books"}
                    >
                      Choose
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      }
    </>
  );
}
