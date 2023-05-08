import React from "react";
import { Table, Button } from "react-bootstrap";

function DataTable({
  columns,
  results,
  handleEdit,
  deleteEntry,
  showConvertOrderIntoBookButton,
  convertIntoBook,
}) {
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
  );
}

export default DataTable;
