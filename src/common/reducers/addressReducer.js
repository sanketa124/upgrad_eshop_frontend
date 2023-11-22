const initialState = {address: null };
  
export default function addressReducer(state = initialState, action) {
    switch (action.type) {
      case 'service/selectAddress': {
        state.address = action.payload;
        return state;
      }
      default:
        return state;
    }
}
