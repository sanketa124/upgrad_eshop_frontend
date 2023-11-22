const initialState = { order: null };
  
export default function orderReducer(state = initialState, action) {
    switch (action.type) {
      case 'service/addOrder': {
        state.order = action.payload;
        return state;
      }
      default:
        return state;
    }
}
  