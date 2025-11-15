import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import communityReducer from "./features/communitySlice";
import appointmentReducer from "./features/appointmentSlice";
import chatReducer from "./features/chatSlice";
import socketReducer from "./features/socketSlice";
import prescriptionReducer from "./features/prescriptionSlice";


const store = configureStore({
  reducer: {
    prescription: prescriptionReducer,
    auth: authReducer,
    user: userReducer,
    community: communityReducer,
    appointment: appointmentReducer,
    chat: chatReducer,
    socket: socketReducer,
  },
});

export default store;