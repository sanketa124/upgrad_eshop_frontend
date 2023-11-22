// Account Routes
export const ROUTE_ROOT = "/";
export const ROUTE_LOGIN = "/login";
export const ROUTE_SIGN_UP = "/signup";
export const ROUTE_PRODUCTS = "/products";
export const ROUTE_PRODUCT_DETAIL = `${ROUTE_PRODUCTS}/:id`;
export const ROUTE_PRODUCT_ORDER = `${ROUTE_PRODUCTS}/:id/order`;
export const ROUTE_PRODUCT_ORDER_CONFIRM = `${ROUTE_PRODUCTS}/:id/order/confirm`;

export const ROUTE_PRODUCT_ADD = "/products/add";
export const ROUTE_PRODUCT_MODIFY = "/products/modify";