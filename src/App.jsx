import React from "react";
import Title from "./components/Title";
import Calculator from "./components/Calculator";
import { useState } from "react";

function App() {
  return (
    <div className="bg-">
      <Title />
      <Calculator />
    </div>
  );
}

export default App;
