import { addMessageToCurrentChat } from "../redux/features/chatSlice";

let socket = null;
let currentRoomId = null;

export const connectSocket = (roomId, dispatch) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("⚠️ Socket already connected. Disconnecting first...");
    disconnectSocket();
  }

  const token = localStorage.getItem("access") || "";

  const wsUrl = `wss://medtrax.me/ws/chat/${roomId}/?token=${token}`;
  console.log(`🔵 Connecting to room ${roomId}...`);

  socket = new WebSocket(wsUrl);
  currentRoomId = roomId;

  socket.onopen = () => {
    console.log(`✅ WebSocket connected to room ${roomId}`);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === "connection_established") {
        console.log("🎉 Connection established");
      } else if (data.type === "chat_message") {
        dispatch(addMessageToCurrentChat(data.message));
      }
    } catch (error) {
      console.error("❌ Error parsing WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log(`🔴 WebSocket disconnected. Code: ${event.code}`);
    socket = null;
    currentRoomId = null;
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
    currentRoomId = null;
  }
};

export const sendSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }));
  } else {
    console.error("❌ WebSocket not connected");
  }
};

export const getSocket = () => socket;
export const getCurrentRoomId = () => currentRoomId;
