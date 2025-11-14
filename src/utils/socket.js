import { addMessageToCurrentChat } from "../redux/features/chatSlice";

let socket = null;
let currentRoomId = null;

export const connectSocket = (roomId, dispatch) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("⚠️ Socket already connected. Disconnecting first...");
    disconnectSocket();
  }

  // const token = localStorage.getItem("access");
  // if (!token) {
  //   console.error("❌ No access token found");
  //   return;
  // }

   const wsUrl = `wss://medtrax.me/ws/chat/${roomId}/`;
  console.log(`🔵 Connecting to room ${roomId}...`);
  socket = new WebSocket(wsUrl);
  currentRoomId = roomId;

  socket.onopen = () => {
    console.log(`✅ WebSocket connected to room ${roomId}`);
    console.log(`📡 WebSocket state: ${socket.readyState}`);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📩 Message received:", data);

      if (data.type === "connection_established") {
        console.log("🎉 Connection established:", data.message);
        // Messages are already loaded via REST API
      } else if (data.type === "chat_message") {
        // Add new message to Redux store
        dispatch(addMessageToCurrentChat({
          id: data.message_id,
          sender_id: data.sender_id,
          sender: {
            id: data.sender_id,
            username: data.sender_username,
            full_name: data.sender_full_name
          },
          sender_role: data.sender_role,
          content: data.message,
          timestamp: data.timestamp,
          is_read: false,
        }));
      } else if (data.type === "typing") {
        console.log(`⌨️ ${data.username} is typing...`);
        // Handle typing indicator if needed
      }
    } catch (error) {
      console.error("❌ Error parsing WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log(`🔴 WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
    socket = null;
    currentRoomId = null;
  };
};

export const disconnectSocket = () => {
  if (socket) {
    console.log(`🚪 Closing WebSocket connection to room ${currentRoomId}`);
    socket.close();
    socket = null;
    currentRoomId = null;
  }
};

export const sendSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }));
    console.log("📤 Message sent via WebSocket:", message);
  } else {
    console.error("❌ WebSocket is not connected. Cannot send message.");
  }
};

export const getSocket = () => socket;
export const getCurrentRoomId = () => currentRoomId;