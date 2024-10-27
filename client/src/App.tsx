import React from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Homepage from "./Homepage";
import Conversation from "./conversation";

function App() {
  const data = "krish";
  return (
    <div className="App">
      {/* <Login /> */}
      <Homepage />
    </div>
  );
}

export default App;
