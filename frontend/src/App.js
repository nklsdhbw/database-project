// import libraries
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import components
import Login from "./Login.js";
import Overview from "./Overview.js";
import Register from "./Register.js";

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
