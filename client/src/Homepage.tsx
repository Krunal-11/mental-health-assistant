// src/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        style={{ height: "64px", backgroundColor: "#000000" }}
      >
        {" "}
        {/* Change here */}
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
          padding: 0, // Remove padding to utilize full height
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
              height: "100%", // Make box full height
              width: "100%", // Make box full width
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
                }} // Use your desired blue color
                size="large"
                onClick={() => navigate("/conversation")}
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
