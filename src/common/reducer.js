import { combineReducers } from 'redux';

import addressReducer from './reducers/addressReducer';
import orderReducer from './reducers/orderReducer';
import userReducer from './reducers/userReducer';
import productReducer from './reducers/productReducer';

const rootReducer = combineReducers({
  addresses: addressReducer,
  orders: orderReducer,
  products: productReducer,
  users: userReducer,
});

export default rootReducer;