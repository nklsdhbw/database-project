// import libraries
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import components
import Login from "./Login.js";
import Overview from "./Overview.js";
import Register from "./Register.js";
import Views from "./Views.js";
import TableSearch from "./TableSearch.js";
import Playground from "./Playground.js";
import NavigationMenue from "./NavigationMenue.js";

// import required css
//import "./App.css";

const App = () => {
  // create routes for routing between the sites
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="*" element={<Login />} />
        <Route path="/Overview" element={<Overview />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Views" element={<Views />} />
        <Route path="/Search" element={<TableSearch />} />
        <Route path="/Playground" element={<Playground />} />
        <Route path="/NavigationMenue" element={<NavigationMenue />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
