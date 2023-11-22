import * as React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchAppBar from "../../common/navbar/Navbar";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useEffect } from "react";
import { generatePath, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ROUTE_PRODUCT_ORDER } from "../../common/routes";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { LS_ESHOP_ACCESS_TOKEN } from "../../common/constants";
import { ROUTE_LOGIN } from "../../common/routes";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const defaultTheme = createTheme();
let activeOrder = {};

export default function ProductDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [initailized, setInitialized] = useState(false);
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(0);
  const [orderPrice, setOrderPrice] = useState(0);
  const { order } = useSelector((state) => state.orders);
  const [productCategories, setProductCategories] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (!localStorage.getItem(LS_ESHOP_ACCESS_TOKEN)) {
      navigate(ROUTE_LOGIN);
    }
  }, [localStorage.getItem(LS_ESHOP_ACCESS_TOKEN)]);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
      fetchProductCategories()
    }
  }, [id]);

  const fetchProductCategories = async () => {
    const response = await fetch("http://0.0.0.0:8080/product-categories");
    const result = await response.json();
    if (result?.data) {
      setProductCategories(["all", ...result.data]);
    }
  };

  useEffect(() => {
    setOrderPrice(order?.orderPrice);
    setQuantity(order?.orderQuantity);
  }, [order]);

  const fetchProductById = async (id) => {
    const response = await fetch(`http://0.0.0.0:8080/products/${id}`);
    const result = await response.json();
    if (result?.data) {
      setProduct(result.data);
    }
    setInitialized(true);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    if (product.availableItems < value) {
      alert("Selected Order Quantity greater than Available Items.");
      setQuantity(product.availableItems);
      setOrderPrice(product.availableItems * product.price);
      return;
    }
    setQuantity(value);
    setOrderPrice(value * product.price);
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    activeOrder = product;
    activeOrder.orderQuantity = quantity;
    activeOrder.orderPrice = orderPrice;
    dispatch({ type: "service/addOrder", payload: activeOrder });
    navigate(generatePath(ROUTE_PRODUCT_ORDER, { id }));
  };

  if (!initailized) return null;

  return (
    <ThemeProvider theme={defaultTheme}>
      <SearchAppBar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            minWidth: "max-content",
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            value={category}
            exclusive
            onChange={(e) => setCategory(e.target.value)}
            aria-label="category"
          >
            {productCategories.map((ctg, index) => {
              return (
                <ToggleButton
                  value={ctg}
                  key={index}
                  selected={ctg === category}
                >
                  {ctg}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Box>
      </Container>
      <Grid
        sx={{ margin: "2%" }}
        justifyContent="center"
        alignItems="flex-start"
        container
        spacing={2}
      >
        <Grid item xs={3}>
          <img
            style={{ maxWidth: "-webkit-fill-available", borderRadius: "5%" }}
            src={product.imageUrl}
            alt={product.name}
          />
        </Grid>
        <Grid item xs={5}>
          <Grid
            justifyContent="center"
            alignItems="flex-start"
            container
            spacing={2}
          >
            <Grid item xs={8}>
              <Grid
                justifyContent="flex-start"
                alignItems="center"
                container
                spacing={2}
              >
                <Grid item xs={4}>
                  <h1>{product.name} </h1>
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    label={"Available Items: " + product.availableItems}
                    color="primary"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Grid
                justifyContent="flex-start"
                alignItems="center"
                container
                spacing={2}
              >
                <Grid item xs={2}>
                  Category:
                </Grid>
                <Grid item xs={4}>
                  <h4>{product.category}</h4>
                </Grid>
              </Grid>
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
              {product.description}
            </Grid>
            <Grid item xs={8}>
              &#8377; {orderPrice}
            </Grid>
            <Grid item xs={8}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="quantity"
                label="Quantity"
                id="quantity"
                value={quantity}
                onChange={handleChange}
                autoComplete="quantity"
              />
            </Grid>
            <Grid item xs={8}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handlePlaceOrder}
                sx={{ maxWidth: "40%", mt: 3, mb: 2 }}
              >
                Place Order
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
