import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CustomStepper from "../../common/customstepper/CustomStepper";
import SearchAppBar from "../../common/navbar/Navbar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ROUTE_ROOT } from "../../common/routes";
import { generatePath, useParams } from "react-router-dom";
import { ROUTE_PRODUCT_ORDER } from "../../common/routes";
import { useSelector } from "react-redux";
import { useState } from "react";
import PositionedSnackbar from "../../common/customsnackbar/CustomSnackbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { LS_ESHOP_ACCESS_TOKEN } from "../../common/constants";
import { ROUTE_LOGIN } from "../../common/routes";

const defaultTheme = createTheme();

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { address } = useSelector((state) => state.addresses);
  const { order } = useSelector((state) => state.orders);

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

  function handleBack(event) {
    navigate(generatePath(ROUTE_PRODUCT_ORDER, { id }));
  }

  const handlePlaceOrder = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    const response = await fetch("http://0.0.0.0:8080/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const result = response.json();
    result
      .then((res) => {
        if (res?.success) {
          setShowSnackBar({
            show: true,
            message: res?.message || "Order placed successfully!",
            type: "success",
          });
          setTimeout(() => {
            dispatch({ type: "service/addOrder", payload: undefined });
            dispatch({ type: "service/selectAddress", payload: undefined });
            navigate(ROUTE_ROOT);
          }, 1000);
        } else {
          setShowSnackBar({
            show: true,
            message: "Something went wrong. Try again!",
            type: "error",
          });
        }
      })
      .catch((err) => {
        setShowSnackBar({
          show: true,
          message: "Something went wrong. Try again!",
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
      <Card
        variant="outlined"
        sx={{
          marginLeft: "3%",
          marginRight: "3%",
          marginTop: "5px",
          minWidth: 275,
        }}
      >
        <CardContent>
          <Grid
            sx={{ margin: "2%" }}
            justifyContent="center"
            alignItems="flex-start"
            container
            spacing={2}
          >
            <Grid justifyContent="flex-start" item xs={6}>
              <Grid
                justifyContent="flex-start"
                alignItems="flex-start"
                container
                spacing={2}
              >
                <Grid item xs={8}>
                  <h2>{order?.name} </h2>
                </Grid>
                <Grid item xs={8}>
                  Quantity: <b>{order?.orderQuantity}</b>
                </Grid>
                <Grid item xs={8}>
                  Category: <b>{order?.category}</b>
                </Grid>
                <Grid
                  sx={{
                    overflowWrap: "break-word",
                    overflowY: "clip",
                    maxHeight: "200px",
                  }}
                  item
                  xs={8}
                >
                  {order?.description}
                </Grid>
                <Grid item xs={8} style={{ color: "red" }}>
                  Total Price: &#8377; {order?.orderPrice}
                </Grid>
              </Grid>
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item xs={4}>
              <Grid
                justifyContent="center"
                alignItems="flex-start"
                container
                spacing={2}
              >
                <Grid item xs={8}>
                  <h2>Address Details: </h2>
                </Grid>
                <Grid item xs={8}>
                  {address?.name}
                </Grid>
                <Grid item xs={8}>
                  Contact Number: {address?.contactNumber}
                </Grid>
                <Grid item xs={8}>
                  {address?.street}
                  {", "} {address?.city}
                </Grid>
                <Grid item xs={8}>
                  {address?.state}
                </Grid>
                <Grid item xs={8}>
                  {address?.zipcode}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid
        sx={{ padding: "1%", marginTop: "2px" }}
        justifyContent="center"
        alignItems="flex-start"
        container
        spacing={2}
      >
        <Button onClick={handleBack} variant="text">
          Back
        </Button>
        <Button onClick={handlePlaceOrder} variant="contained" type="submit">
          Place Order
        </Button>
      </Grid>
    </ThemeProvider>
  );
}
