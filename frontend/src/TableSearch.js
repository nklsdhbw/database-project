import React, { useState } from "react";
import { Table, Input } from "antd";
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
      <Table
        rowKey="name"
        dataSource={filteredData}
        columns={userColumns}
        loading={loading}
        pagination={false}
      />
    </>
  );
}
