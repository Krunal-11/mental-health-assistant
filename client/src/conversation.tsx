import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define message type
type Message = {
  text: string;
  sender: "user" | "bot";
};

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
   const navigate = useNavigate()

  const handleSendMessage = async () => {
    if (input.trim()) {
      // Add user's message to the messages array
      const userMessage: Message = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Clear the input field
      setInput("");

      try {
        // Send user message to the backend API
        const response = await axios.post("http://localhost:5000/api/chat", {
          message: input,
        });

        // Extract bot response from API response
        const botMessage: Message = {
          text: response.data.reply, // Adjust based on actual response format
          sender: "bot",
        };

        // Update messages with the bot's response
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error fetching bot response:", error);
      }
    }
  };

  const handleEndConversation = async () => {
    try {
      await axios.post("http://localhost:5000/api/chat/end");
      navigate("/stats"); // Navigate to /stats after successful request
    } catch (error) {
      console.error("Error ending conversation:", error);
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
            onKeyPress={handleKeyPress}
            sx={{
              marginRight: 1,
              bgcolor: "#555",
              borderRadius: "20px",
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
            onClick={handleEndConversation}
            sx={{ borderRadius: "20px", marginRight: "10px" }}
          >
            End
          </Button>
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
