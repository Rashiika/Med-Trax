import { createSlice } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket, getSocket } from "../../utils/socket";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    isConnected: false,
    liveMessages: [],
  },
  reducers: {
    connectSocketAction: (state, action) => {
      const userId = action.payload;
      state.socket = connectSocket(userId);
      state.isConnected = true;
    },
    disconnectSocketAction: (state) => {
      disconnectSocket();
      state.socket = null;
      state.isConnected = false;
    },
    receiveLiveMessage: (state, action) => {
      state.liveMessages.push(action.payload);
    },
    sendLiveMessage: (state, action) => {
      const socket = getSocket();
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(action.payload));
        state.liveMessages.push(action.payload); 
      }
    },
    clearLiveMessages: (state) => {
      state.liveMessages = [];
    },
  },
});

export const {
  connectSocketAction,
  disconnectSocketAction,
  receiveLiveMessage,
  sendLiveMessage,
  clearLiveMessages,
} = socketSlice.actions;
export default socketSlice.reducer;
