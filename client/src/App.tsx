import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext"; // Import the SessionProvider
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Homepage from "./Homepage";
import Conversation from "./Conversation";
import Stats from "./Stats";

// Create a custom dark theme
const theme = createTheme({
  palette: {
    mode: "dark", // Enables dark mode
    primary: {
      main: "#90caf9", // Primary color
    },
    secondary: {
      main: "#f48fb1", // Secondary color
    },
  },
});

function App() {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </SessionProvider>
  );
}



export default App;
