import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import communityReducer from "./features/communitySlice";
import appointmentReducer from "./features/appointmentSlice";
import chatReducer from "./features/chatSlice";
import socketReducer from "./features/socketSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    community: communityReducer,
    appointment: appointmentReducer,
    chat: chatReducer,
    socket: socketReducer,
  },
});

export default store;