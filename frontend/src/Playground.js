import { useState } from "react";

function Playground() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleIdBlur = async () => {
    const data = await fetch(`/api/users/${id}`);
    setName(data.name);
    setPhone(data.phone);
  };

  const filteredName = searchQuery
    ? name.toLowerCase().includes(searchQuery.toLowerCase())
    : true;
  const filteredPhone = searchQuery
    ? phone.toLowerCase().includes(searchQuery.toLowerCase())
    : true;

  return (
    <>
      <input
        type="text"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        onBlur={handleIdBlur}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={!!id}
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={!!id}
      />
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </>
  );
}
export default Playground;
