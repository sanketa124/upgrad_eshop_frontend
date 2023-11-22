import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import SearchAppBar from "../../common/navbar/Navbar";
import { Copyright } from "../../common/Copyright";
import { useState } from "react";
import PositionedSnackbar from "../../common/customsnackbar/CustomSnackbar";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleChange = (event) => {
    const result = event.target.value.replace(/\D/g, "");
    setValue(result);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let newUser = {
      firstName: data.get("fname"),
      lastName: data.get("lname"),
      email: data.get("email"),
      role: "user",
      password: data.get("password"),
      contactNumber: data.get("contact_number"),
    };

    // Make a POST request to the API
    const response = await fetch("http://0.0.0.0:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const result = response.json();
    result
      .then((res) => {
        if (res?.success) {
          setShowSnackBar({
            show: true,
            message: res?.message || "Successfully Signed Up!",
            type: "success",
          });
          setTimeout(() => navigate("/"), 2000);
        } else {
          setShowSnackBar({
            show: true,
            message: res?.detail || "Failed to Sign Up!",
            type: "error",
          });
        }
      })
      .catch((err) => {
        setShowSnackBar({
          show: true,
          message: "Failed Signed Up. Try again!",
          type: "error",
        });
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <SearchAppBar />
      {showSnackBar.show && (
        <PositionedSnackbar
          dismissOrNot={true}
          message={showSnackBar.message}
          typeOfSnackBar={showSnackBar.type}
        />
      )}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fname"
              label="First Name"
              name="fname"
              autoComplete="fname"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lname"
              label="Last Name"
              id="lname"
              autoComplete="lname"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              id="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              inputProps={{ maxLength: 12, minLength: 8 }}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              inputProps={{ maxLength: 12, minLength: 8 }}
              name="confirm_password"
              label="Confirm Password"
              type="password"
              id="password_confirm"
              autoComplete="confirm-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contact_number"
              label="Contact Number"
              id="contact_no"
              value={value}
              onChange={handleChange}
              autoComplete="contact-number"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid sx={{ display: "block", textAlign: "end" }} container>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
