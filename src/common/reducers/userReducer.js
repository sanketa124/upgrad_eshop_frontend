const initialState = { users: undefined, activeUser: null };

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "db/userAdded": {
      state.users.concat(action.payload);
      return state;
    }
    case "service/userLoggedIn": {
      state.activeUser = action.payload;
      return state;
    }
    case "service/sessionRestore": {
      state = action.payload;
      return state;
    }
    default:
      return state;
  }
}
