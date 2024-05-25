import { init } from "../utils/init";

export const appReducer = (state = init, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state, isLoggedIn: action.payload };
    default:
      return state;
  }
};
