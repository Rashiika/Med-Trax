import { createSlice } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket } from "../../utils/socket";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    isConnected: false,
    currentRoomId: null,
    error: null,
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.isConnected = true;
      state.currentRoomId = action.payload;
      state.error = null;
    },
    setSocketDisconnected: (state) => {
      state.isConnected = false;
      state.currentRoomId = null;
      state.error = null;
    },
    setSocketError: (state, action) => {
      state.error = action.payload;
      state.isConnected = false;
    },
  },
});

export const { setSocketConnected, setSocketDisconnected, setSocketError } = socketSlice.actions;

// Thunk actions for socket operations
export const connectSocketAction = (roomId) => (dispatch) => {
  try {
    connectSocket(roomId, dispatch);
    dispatch(setSocketConnected(roomId));
  } catch (error) {
    dispatch(setSocketError(error.message));
  }
};

export const disconnectSocketAction = () => (dispatch) => {
  disconnectSocket();
  dispatch(setSocketDisconnected());
};

export default socketSlice.reducer;