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
        <Route index element={<Register />} />
        <Route path="*" element={<Register />} />
        <Route path="/Overview" element={<Overview />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
