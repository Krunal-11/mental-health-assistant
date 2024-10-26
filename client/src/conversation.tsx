// src/ConversationPage.tsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Define message type
type Message = {
  text: string;
  sender: "user" | "bot";
};

// Sample conversations
const sampleConversations: Message[] = [
  { text: "Hello! How can I improve my mental health?", sender: "user" },
  {
    text: "It's great that you're seeking help! Let's start with some basic techniques.",
    sender: "bot",
  },
  { text: "What techniques do you recommend?", sender: "user" },
  {
    text: "Mindfulness and meditation can be very helpful. Would you like to try some exercises?",
    sender: "bot",
  },
];

// Create a dark theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1e88e5",
    },
    secondary: {
      main: "#ff4081",
    },
  },
});

const ConversationPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Load sample conversations on component mount
  useEffect(() => {
    setMessages(sampleConversations);
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);

      // Simulated bot response after 1 second
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "I'm here to help! What would you like to discuss?",
            sender: "bot",
          },
        ]);
      }, 1000);

      setInput("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Mental Health Assistant</Typography>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            bgcolor: "#e7f3ff",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  margin: "10px",
                  padding: "10px",
                  maxWidth: "75%",
                  borderRadius: "20px",
                  bgcolor: message.sender === "user" ? "#1e88e5" : "#424242",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            padding: 2,
            display: "flex",
            alignItems: "center",
            bgcolor: "#333",
            borderRadius: "0",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress} // Listen for key presses
            sx={{
              marginRight: 1,
              bgcolor: "#555", // Grayish background
              borderRadius: "20px", // No border radius on bottom corners
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px 20px 0 0",
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                color: "white",
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{ borderRadius: "20px" }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ConversationPage;
