// import libraries
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import components
import Login from "./Login.js";
import Overview from "./Overview.js";
import Register from "./Register.js";
import TableSearch from "./TableSearch.js";
import NavigationMenue from "./NavigationMenue.js";

// import required css
import "../css/App.css";

const App = () => {
  // create routes for routing between the sites
  return (
    <BrowserRouter>
      <div className="app-content">
        <Routes>
          <Route index element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route path="/Overview" element={<Overview />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Search" element={<TableSearch />} />
          <Route path="/NavigationMenue" element={<NavigationMenue />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
