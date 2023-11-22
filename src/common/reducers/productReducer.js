const initialState = { products: undefined,
                       activeProduct: null, selectedProduct: undefined };
  
export default function productReducer(state = initialState, action) {
    switch (action.type) {
      case 'db/productAdded': {
        state.products.concat(action.payload);
        return state;
      }
      case 'service/productSelected': {
        state.activeProduct = action.payload;
        return state;
      }
      case 'db/productModified': {
        state.products[action.payload.id] = action.payload;
        return state;
      }
      case 'db/productDeleted': {
        state.products.splice(action.payload.id, 1);
        return state;
      }
      case 'service/selectProduct':
        state.selectedProduct = action.payload;
        return state;
      default:
        return state;
    }
}
  