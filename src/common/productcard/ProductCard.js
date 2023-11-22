import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DraggableDialog from "../customdialog/Customdialog";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import {
  ROUTE_PRODUCT_DETAIL,
  ROUTE_PRODUCT_MODIFY,
} from "../routes";
import { useState } from "react";
import PositionedSnackbar from "../customsnackbar/CustomSnackbar";

export default function ProductCard({ product, fetchProducts }) {
  const dispatch = useDispatch();
  const [dialog, setDialog] = React.useState(false);
  const navigate = useNavigate();

  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleBuy = (id) => {
    navigate(generatePath(ROUTE_PRODUCT_DETAIL, { id }));
  };

  function handleEdit() {
    dispatch({ type: "service/selectProduct", payload: product });
    navigate(ROUTE_PRODUCT_MODIFY);
  }

  function showDeleteModal(show=true) {
    setDialog(show);
  }

  const handleDelete = async () => {
    const response = await fetch(`http://0.0.0.0:8080/products/${product.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const result = response.json();
    result
      .then((res) => {
        if (res?.success) {
          setShowSnackBar({
            show: true,
            message: `Product ${product?.name} deleted successfully`,
            type: "success",
          });
          showDeleteModal(false)
          fetchProducts()
        } else {
          setShowSnackBar({
            show: true,
            message: "Failed to delete product. Try again!",
            type: "error",
          });
        }
      })
      .catch((err) => {
        setShowSnackBar({
          show: true,
          message: "Failed to delete product. Try again!",
          type: "error",
        });
      });
  };

  function ConditionalDialog() {
    if (dialog) {
      return <DraggableDialog handleDelete={handleDelete} />;
    }
  }

  function IconsToShow() {
    const userState = useSelector((state) => state.users);
    if (userState?.activeUser?.role === "admin") {
      return (
        <Stack direction="row" alignItems="center">
          <IconButton onClick={handleEdit} aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => showDeleteModal()} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Stack>
      );
    }
  }

  return (
    <Card
      sx={{
        width: "18rem",
        height: "24",
      }}
    >
      {showSnackBar.show && (
        <PositionedSnackbar
          dismissOrNot={true}
          message={showSnackBar.message}
          typeOfSnackBar={showSnackBar.type}
        />
      )}
      <ConditionalDialog />
      <CardMedia
        sx={{ height: 250 }}
        image={product.imageUrl}
        title={product.name}
      />
      <CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            &#8377; {product.price}
          </Typography>
        </div>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ height: "9rem", overflow: "hidden" }}
        >
          {product.description}
        </Typography>
      </CardContent>
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <CardActions style={{ padding: 0 }}>
          <Button
            onClick={() => handleBuy(product.id)}
            sx={{ minWidth: "30%" }}
            variant="contained"
          >
            Buy
          </Button>
        </CardActions>
        <IconsToShow />
      </Toolbar>
    </Card>
  );
}
