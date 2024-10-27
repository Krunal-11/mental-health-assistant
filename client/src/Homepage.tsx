// src/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Button,
  Container,
  Typography,
  Box,
  Toolbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Fade } from "@mui/material";
import { useSession } from "./context/SessionContext"; // Import the context

// Create a dark theme
const theme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
    primary: {
      main: "#9999",
    },
    secondary: {
      main: "#ff4081",
    },
  },
});

const HomePage = () => {
  console.log('homepage entered')
  const navigate = useNavigate();
  const { setSessionId } = useSession(); // Destructure setSessionId from context

  const handleStartNewSession = async () => {
  console.log('entered handleStartNewSession');
  try {
    const response = await fetch("http://localhost:3003/api/sessions/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "671dac335809f9a6aea0d4dd",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const sessionId = data.sessionId;

    // Set session ID in context
    setSessionId(sessionId);
    console.log("Session ID set in context:", sessionId);

    // Navigate to conversation page
    navigate("/conversation");
  } catch (error) {
    console.error("Error starting new session:", error);
  }
};


  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        style={{ height: "64px", backgroundColor: "#000000" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mental Health Assistant
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth={false}
        style={{
          height: "calc(100vh - 64px)",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url('https://nw8amhi.org/wp-content/uploads/IMG_0140.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Fade in timeout={1000}>
          <Box
            sx={{
              bgcolor: "rgba(18, 18, 18, 0.8)",
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ color: "text.primary" }}
            >
              Welcome to Your Mental Health Assistant
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "text.secondary" }}
            >
              You can start a new session or check your stats to monitor your
              progress.
            </Typography>
            <Box mt={4}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1e88e5",
                  marginRight: "16px",
                  padding: "12px 24px",
                }}
                size="large"
                onClick={handleStartNewSession} // Update onClick
              >
                Start New Session
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                size="large"
                style={{ padding: "12px 24px" }}
                onClick={() => navigate("/stats")}
              >
                Check Stats
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
