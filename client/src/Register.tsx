// Register.tsx
import React, { useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";

// Sample background image, replace with your image URL
const backgroundImage = "https://nw8amhi.org/wp-content/uploads/IMG_0140.jpg";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate registration process (replace this with actual API call)
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      console.log({ firstName, lastName, email, password });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Add your registration logic here
    } catch (err) {
      setError("Registration failed. Please try again.");
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
        <Box sx={{ zIndex: 2, position: "relative", textAlign: "center" }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: "bold", color: "#fff" }}
          >
            Create an Account
          </Typography>

          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ mt: 3, width: "100%", maxWidth: "360px", zIndex: 2 }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Person sx={{ color: "#aaa", marginRight: 1 }} />
                ),
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
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Person sx={{ color: "#aaa", marginRight: 1 }} />
                ),
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
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Email sx={{ color: "#aaa", marginRight: 1 }} />
                ),
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
              autoComplete="new-password"
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>

            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ color: "#bbb" }}
              >
                Already have an account?{" "}
                <a href="/login" style={{ color: "#4a90e2" }}>
                  Log in
                </a>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Register;
