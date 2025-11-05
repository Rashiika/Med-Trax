import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import communityReducer from "./features/communitySlice";
import appointmentReducer from "./features/appointmentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    community: communityReducer,
    appointment: appointmentReducer,
  },
});

export default store;