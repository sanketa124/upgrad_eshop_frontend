import * as React from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import CustomStepper from "../../common/customstepper/CustomStepper";
import SearchAppBar from "../../common/navbar/Navbar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useParams } from "react-router-dom";
import {
  ROUTE_PRODUCT_DETAIL,
  ROUTE_PRODUCT_ORDER_CONFIRM,
} from "../../common/routes";
import { useNavigate } from "react-router-dom";
import PositionedSnackbar from "../../common/customsnackbar/CustomSnackbar";
import { LS_ESHOP_ACCESS_TOKEN } from "../../common/constants";
import { ROUTE_LOGIN } from "../../common/routes";

const defaultTheme = createTheme();

export default function OrderFillingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const userState = useSelector((state) => state.users);
  const {address} = useSelector((state) => state.addresses);
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (!localStorage.getItem(LS_ESHOP_ACCESS_TOKEN)) {
      navigate(ROUTE_LOGIN);
    }
  }, [localStorage.getItem(LS_ESHOP_ACCESS_TOKEN)]);

  useEffect(() => {
    if(localStorage.getItem(LS_ESHOP_ACCESS_TOKEN)){
      fetchAddresses();
    }
  }, []);

  useEffect(() => {
    setSelectedAddress(address)
  }, [address])

  const fetchAddresses = async () => {
    const response = await fetch("http://0.0.0.0:8080/addresses");
    const result = await response.json();
    if (result?.data) {
      setAddresses(
        result?.data.filter((a) => a.email === userState?.activeUser?.email)
      );
    }
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
    dispatch({ type: "service/selectAddress", payload: event.target.value });
  };

  function CustomMenuItem() {
    let allItems = addresses.map((item) => {
      let completeAddress =
        item.name +
        " --> " +
        item.street +
        " " +
        item.city +
        " " +
        item.state +
        " " +
        item.landmark +
        " " +
        item.zipcode;

      return (
        <MenuItem value={item} key={completeAddress} label={completeAddress}>
          {completeAddress}
        </MenuItem>
      );
    });
    return (
      <span>
        <FormControl required style={{ minWidth: "320px" }}>
          <InputLabel id="demo-simple-select-label">Select Address</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            required
            id="demo-simple-select"
            value={selectedAddress}
            onChange={handleAddressChange}
            label="Select Address"
          >
            {allItems}
          </Select>
        </FormControl>
      </span>
    );
  }

  const handlePrevious = () => {
    navigate(generatePath(ROUTE_PRODUCT_DETAIL, { id }));
  };

  const handleNext = () => {
    if(!selectedAddress){
      setShowSnackBar({
        show: true,
        message: "Please select address!",
        type: "error",
      });
      return
    }
    navigate(generatePath(ROUTE_PRODUCT_ORDER_CONFIRM, { id }));
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payload = {
      email: userState?.activeUser?.email,
      name: data.get("name"),
      contactNumber: data.get("contact_number"),
      city: data.get("city"),
      landmark: data.get("landmark"),
      street: data.get("street"),
      state: data.get("state"),
      zipcode: data.get("zipcode"),
    };

    const response = await fetch("http://0.0.0.0:8080/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = response.json();
    result
      .then((res) => {
        if (res?.success) {
          fetchAddresses();
        }
      })
      .catch((err) => {});
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
      <Card
        sx={{
          padding: "1%",
          marginLeft: "3%",
          marginRight: "3%",
          marginTop: "3%",
          minWidth: 275,
          border: "none",
          boxShadow: "none",
        }}
      >
        <CustomStepper />
      </Card>
      <Grid
        sx={{ padding: "1%" }}
        justifyContent="center"
        alignItems="flex-start"
        container
        spacing={2}
      >
        <CustomMenuItem />
      </Grid>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Add Address
          </Typography>
          <Box component="form" onSubmit={handleAddressSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contact_number"
              label="Contact Number"
              id="contact_number"
              autoComplete="contact_number"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="street"
              label="Street"
              name="street"
              autoComplete="street"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="city"
              label="City"
              id="city"
              autoComplete="city"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="state"
              label="State"
              name="state"
              autoComplete="state"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              name="landmark"
              label="Landmark"
              id="landmark"
              autoComplete="landmark"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="zipcode"
              label="Zip Code"
              id="zipcode"
              autoComplete="zipcode"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save Address
            </Button>
          </Box>
        </Box>
      </Container>
      <Grid
        sx={{ padding: "1%" }}
        justifyContent="center"
        alignItems="flex-start"
        container
        spacing={2}
      >
        <Button onClick={handlePrevious} variant="text">
          Back
        </Button>
        <Button
          onClick={handleNext}
          variant="contained"
        >
          Next
        </Button>
      </Grid>
    </ThemeProvider>
  );
}
