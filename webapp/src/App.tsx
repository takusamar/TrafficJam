import React from "react";
import "./App.css";
import { Home } from "./pages/Home";
import { TrafficsProvider } from "./contexts/Traffics";

function App() {
  return (
    <TrafficsProvider>
      <Home />
    </TrafficsProvider>
  );
}

export default App;
