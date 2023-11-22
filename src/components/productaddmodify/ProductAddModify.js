import * as React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import SearchAppBar from "../../common/navbar/Navbar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_LOGIN, ROUTE_ROOT } from "../../common/routes";
import PositionedSnackbar from "../../common/customsnackbar/CustomSnackbar";
import { LS_ESHOP_ACCESS_TOKEN } from "../../common/constants";

const defaultTheme = createTheme();
const INITIAL_STATE = {
  availableItems: "",
  category: "",
  description: "",
  id: "",
  imageUrl: "",
  manufacturer: "",
  name: "",
  price: "",
};

export default function ProductUpsert({ type }) {
  const isEdit = type === "edit";
  const productState = useSelector((state) => state.products);
  const [productDetail, setProductDetail] = useState();
  const [productCategories, setProductCategories] = useState([]);
  const navigate = useNavigate();

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
    if (productState?.selectedProduct && isEdit) {
      setProductDetail(productState.selectedProduct);
    } else {
      setProductDetail(INITIAL_STATE);
    }
    fetchProductCategories();
  }, [isEdit, productState]);

  const fetchProductCategories = async () => {
    const response = await fetch("http://0.0.0.0:8080/product-categories");
    const result = await response.json();
    if (result?.data) {
      setProductCategories(result.data);
    }
  };

  let activeProduct = undefined;
  if (productState?.selectedProduct) {
    activeProduct = productState.selectedProduct;
  }

  function handleClick(event) {
    event.preventDefault();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEdit) {
      const response = await fetch(`http://0.0.0.0:8080/products/${productDetail.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDetail),
      });
      const result = response.json();
      result
        .then((res) => {
          if (res?.success) {
            setShowSnackBar({
              show: true,
              message: `Product ${productDetail?.name} modified successfully`,
              type: "success",
            });
            setTimeout(() => navigate(ROUTE_ROOT), 1000);
          } else {
            setShowSnackBar({
              show: true,
              message: "Failed to updated product. Try again!",
              type: "error",
            });
          }
        })
        .catch((err) => {
          setShowSnackBar({
            show: true,
            message: "Failed to updated product. Try again!",
            type: "error",
          });
        });
    } else {
      delete productDetail.id;
      const response = await fetch("http://0.0.0.0:8080/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDetail),
      });
      const result = response.json();
      result
        .then((res) => {
          if (res?.success) {
            setShowSnackBar({
              show: true,
              message: `Product ${productDetail?.name} added successfully`,
              type: "success",
            });
            setTimeout(() => navigate(ROUTE_ROOT), 1000);
          } else {
            setShowSnackBar({
              show: true,
              message: "Failed to add product. Try again!",
              type: "error",
            });
          }
        })
        .catch((err) => {
          setShowSnackBar({
            show: true,
            message: "Failed to add product. Try again!",
            type: "error",
          });
        });
    }
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
      <Grid
        sx={{ padding: "2%" }}
        justifyContent="center"
        alignItems="flex-start"
        container
        spacing={2}
      >
        <Typography component="h1" variant="h5">
          {type === "add" ? "Add" : "Modify"} Product
        </Typography>
      </Grid>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          component="form"
          onSubmit={handleClick}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            value={productDetail?.name}
            label="Name"
            name="name"
            placeholder="Product Name"
            onChange={(e) => {
              const { value } = e.target;
              setProductDetail({ ...productDetail, name: value });
            }}
          />
          <FormControl style={{ minWidth: "100%" }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={productDetail?.category}
              label="Category"
              onChange={(e) => {
                const { value } = e.target;
                setProductDetail({ ...productDetail, category: value });
              }}
            >
              {productCategories.map((ctg, index) => {
                return (
                  <MenuItem
                    value={ctg}
                    key={index}
                    style={{ textTransform: "capitalize" }}
                  >
                    {ctg}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="manufacturer"
            label="Manufacturer"
            value={productDetail?.manufacturer}
            name="manufacturer"
            autoFocus
            onChange={(e) => {
              const { value } = e.target;
              setProductDetail({ ...productDetail, manufacturer: value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="items"
            label="Available Items"
            value={productDetail?.availableItems}
            type="items"
            id="items"
            onChange={(e) => {
              const { value } = e.target;
              setProductDetail({ ...productDetail, availableItems: value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            value={productDetail?.price}
            name="price"
            autoFocus
            onChange={(e) => {
              const { value } = e.target;
              setProductDetail({ ...productDetail, price: value });
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            name="imageUrl"
            label="Image URL"
            value={productDetail?.imageUrl}
            id="imageUrl"
            onChange={(e) => {
              const { value } = e.target;
              setProductDetail({ ...productDetail, imageUrl: value });
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            name="description"
            value={productDetail?.description}
            label="Product Description"
            id="description"
            onChange={(e) => {
              const { value } = e.target;
              setProductDetail({ ...productDetail, description: value });
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            {type === "add" ? "Save" : "Modify"} Product
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
