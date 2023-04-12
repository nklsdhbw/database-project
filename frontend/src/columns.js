export const userColumns = [
  {
    title: "authorID",
    dataIndex: "authorID",
    key: "authorID",
  },
  {
    title: "authorName",
    dataIndex: "authorName",
    key: "authorName",
  },
  {
    title: "authorEmail",
    dataIndex: "authorEmail",
    key: "authorEmail",
  },
  {
    title: "authorPhone",
    dataIndex: "authorPhone",
    key: "authorPhone",
  },
];

/*

export const userColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Address",
    key: "address",
    render: (record) => {
      return Object.values(record.address)
        .filter((val) => typeof val !== "object")
        .join(" ");
    },
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Website",
    dataIndex: "website",
    key: "website",
  },
];
*/
