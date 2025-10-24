import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./features/roleSlice";
import authReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    role: roleReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;