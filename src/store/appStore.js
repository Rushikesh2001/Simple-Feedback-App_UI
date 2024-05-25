import { appReducer } from "../reducer/appReducer";
import { configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";

export const appStore = configureStore({
  reducer: {
    appReducer,
  },
  middleware: () => [logger],
});
