// src/components/Register.js
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CopyRight from "../components/CopyRight";
import axios from "../services/api";

const defaultTheme = createTheme();

const Register = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePhoneInputChange = (value, data, event) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      phoneNumber: value,
    }));
  };

  const handleRegister = (event) => {
    event.preventDefault();
    axios
      .post("/auth/register", newUser)
      .then((response) => {
        const data = response.data;
        alert(`Registration successful: ${data.message}`);
      })
      .catch((error) => {
        if (error.response) {
          alert(`Registration failed: ${error.response.data.error}`);
        } else {
          alert(`Registration failed: ${error.message}`);
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 0,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main", my: 10 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ color: "#7A7D76" }}
              mb={4}
            >
              Welcome to ShareLister
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleRegister}
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    onChange={handleOnChange}
                    required
                    fullWidth
                    id="firstName"
                    variant="standard"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    onChange={handleOnChange}
                    label="Last Name"
                    name="lastName"
                    variant="standard"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <PhoneInput
                    required
                    fullWidth
                    country={"us"}
                    name="phoneNumber"
                    value={newUser.phoneNumber}
                    inputClass={"PhoneInput"}
                    onChange={handlePhoneInputChange}
                    inputStyle={{ width: "100%", border: "0" }}
                    buttonStyle={{ border: 0 }}
                    containerClass={""}
                    containerStyle={{ marginTop: "16px" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    onChange={handleOnChange}
                    name="email"
                    variant="standard"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={handleOnChange}
                    variant="standard"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link href="/login" variant="body2">
                    {"Alredy Have Account?"}
                  </Link>
                </Grid>
              </Grid>
              <CopyRight sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Register;
