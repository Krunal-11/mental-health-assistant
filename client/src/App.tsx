import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Homepage from "./Homepage";
import Conversation from "./conversation";
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
  const data = "krish";

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {/* Uncomment the component you want to render */}
        {/* <Login /> */}
        {/* <Register /> */}
        {/* <Homepage /> */}
        {/* <Conversation /> */}
        <Stats />
      </div>
    </ThemeProvider>
  );
}

export default App;
