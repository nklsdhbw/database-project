import React, { useState } from "react";
import { Input } from "antd";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { userColumns } from "./columns";
import { useTableSearch } from "./useTableSearch";

const { Search } = Input;

const fetchUsers = async () => {
  let data;
  let table = "Authors";
  await axios
    .post("http://localhost:5000/run-query", {
      query: `SELECT * FROM public."${table}"`,
    })
    .then((response) => {
      console.log(response.data);
      let data2 = response.data;
      console.log(data2);
      console.log(typeof data2);
      let entries = Object.values(data2);
      console.log("Entries", entries, typeof entries);
      const result = data2.map(([a, b, c, d]) => ({
        authorID: a,
        authorName: b,
        authorEmail: c,
        authorPhone: d,
      }));

      data = result;
      return { result };
    })
    .catch((error) => {
      console.log(error);
    });
  return { data };
};

/*
const fetchUsers = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/users/"
  );
  console.log(data);
  console.log(typeof data);
  return { data };
};
*/

export default function TableSearch() {
  const [searchVal, setSearchVal] = useState(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers,
  });

  return (
    <>
      <Search
        onChange={(e) => setSearchVal(e.target.value)}
        placeholder="Search"
        enterButton
        style={{ position: "sticky", top: "0", left: "0" }}
      />
      <br /> <br />
      {
        /*<Table
        rowKey="name"
        dataSource={filteredData}
        columns={userColumns}
        loading={loading}
        pagination={false}
      />
      */
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
                        <div>{value}</div>
                      </div>
                    </td>
                  ))}
                  <td>
                    <button
                      className="w-100 btn btn-lg btn-primary"
                      onClick={console.log("hi")}
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
