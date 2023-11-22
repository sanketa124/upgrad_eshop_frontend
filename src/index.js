import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signup/SignUp";
import Products from "./components/products/Products";
import ProductDetail from "./components/productsdetail/ProductsDetail";
import OrderPage from "./components/orderpage/OrderPage";
import OrderConfirmationPage from "./components/orderconfirmation/OrderConfirmation";
import ProductAddModify from "./components/productaddmodify/ProductAddModify";
import { Provider } from "react-redux";
import store from "./common/store";
import {
  ROUTE_LOGIN,
  ROUTE_ROOT,
  ROUTE_SIGN_UP,
  ROUTE_PRODUCT_DETAIL,
  ROUTE_PRODUCT_ORDER,
  ROUTE_PRODUCT_ORDER_CONFIRM,
  ROUTE_PRODUCT_ADD,
  ROUTE_PRODUCT_MODIFY,
} from "./common/routes";
import "./index.css";

const router = createBrowserRouter([
  {
    path: ROUTE_ROOT,
    element: <Products />,
  },
  {
    path: ROUTE_LOGIN,
    element: <SignIn />,
  },
  {
    path: ROUTE_SIGN_UP,
    element: <SignUp />,
  },
  {
    path: ROUTE_PRODUCT_DETAIL,
    element: <ProductDetail />,
  },
  {
    path: ROUTE_PRODUCT_MODIFY,
    element: <ProductAddModify type="edit" />,
  },
  {
    path: ROUTE_PRODUCT_ADD,
    element: <ProductAddModify type="add" />,
  },
  {
    path: ROUTE_PRODUCT_ORDER,
    element: <OrderPage />,
  },
  {
    path: ROUTE_PRODUCT_ORDER_CONFIRM,
    element: <OrderConfirmationPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
