
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import SearchAppBar from "../../common/navbar/Navbar";
import { Copyright } from "../../common/Copyright";
import { useState } from "react";
import PositionedSnackbar from "../../common/customsnackbar/CustomSnackbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LS_ESHOP_ACCESS_TOKEN, LS_ESHOP_EMAIL } from "../../common/constants";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ROUTE_ROOT } from "../../common/routes";

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      username: data.get("email"),
      password: data.get("password"),
    };

    const response = await fetch("http://0.0.0.0:8080/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = response.json();
    result
      .then((res) => {
        if (res?.token) {
          localStorage.setItem(LS_ESHOP_ACCESS_TOKEN, res.token.access_token);
          localStorage.setItem(LS_ESHOP_EMAIL, res.user.email);
          dispatch({ type: 'service/userLoggedIn', payload: res.user })
          setTimeout(() => navigate(ROUTE_ROOT), 1000);
        } else {
          setShowSnackBar({
            show: true,
            message: "Failed to Login. Try again!",
            type: "error",
          });
        }
      })
      .catch((err) => {
        setShowSnackBar({
          show: true,
          message: "Failed to Login. Try again!",
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
