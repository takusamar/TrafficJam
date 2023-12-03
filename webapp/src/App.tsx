import React from "react";
import "./App.css";
import { Home } from "./pages/Home";
import { FirebaseProvider } from "./contexts/FirebaseProvider";

function App() {
  return (
    <FirebaseProvider>
      <Home />
    </FirebaseProvider>
  );
}

export default App;
