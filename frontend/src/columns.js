export const userColumns = [
  {
    title: "bookID",
    dataIndex: "bookID",
    key: "bookID",
  },
  {
    title: "bookTitle",
    dataIndex: "bookTitle",
    key: "bookTitle",
  },
  {
    title: "bookAuthor",
    dataIndex: "bookAuthor",
    key: "bookAuthor",
  },
  {
    title: "bookPublisherName",
    dataIndex: "bookPublisherName",
    key: "bookPublisherName",
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
