// Login.tsx
import React, { useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";

// Sample background image, replace with your image URL
const backgroundImage = "https://nw8amhi.org/wp-content/uploads/IMG_0140.jpg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a login process (replace this with actual API call)
    try {
      console.log(email, password);
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Add your login logic here
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)",
        }}
      />

      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c1c1e",
          color: "#fff",
          padding: 4,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontWeight: "bold", color: "#fff" }}
        >
          Welcome Back!
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ mt: 3, width: "100%", maxWidth: "360px" }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <Email sx={{ color: "#aaa", marginRight: 1 }} />,
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#777" },
                "&.Mui-focused fieldset": { borderColor: "#888" },
                color: "#fff",
              },
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <Lock sx={{ color: "#aaa", marginRight: 1 }} />,
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#777" },
                "&.Mui-focused fieldset": { borderColor: "#888" },
                color: "#fff",
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                value={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ color: "#aaa" }}
              />
            }
            label={<Typography sx={{ color: "#bbb" }}>Remember Me</Typography>}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              mt: 4,
              mb: 2,
              backgroundColor: "#0056D2",
              "&:hover": { backgroundColor: "#0041a3" },
              fontWeight: "bold",
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ color: "#bbb" }}
            >
              <a href="/forgot-password" style={{ color: "#4a90e2" }}>
                Forgot Password?
              </a>
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ color: "#bbb" }}
            >
              Don’t have an account?{" "}
              <a href="/register" style={{ color: "#4a90e2" }}>
                Sign up
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
