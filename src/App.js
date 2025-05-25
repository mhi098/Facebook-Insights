import React from "react";
import Insights from "./Insights";
import "./App.css";
import Monetization from "./Monetization";
import { Route, Routes } from "react-router-dom";
import AddEarning from "./AddEarning";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Monetization />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/add_earning" element={<AddEarning />} />
    </Routes>
  );
};

export default App;
