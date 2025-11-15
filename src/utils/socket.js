// socket.js
import { addMessageToCurrentChat } from "../redux/features/chatSlice";
import { 
  setSocketConnected,
  setSocketDisconnected,
  setSocketError
} from "../redux/features/socketSlice";

let socket = null;
let currentRoomId = null;
let isManuallyClosed = false;

// If needed in future:
// const WS_BASE_URL = process.env.REACT_APP_WS_URL || "wss://medtrax.me";

export const connectSocket = (roomId, dispatch) => {
  try {
    console.log(`🔌 [SOCKET] Connecting to room ${roomId}...`);

    // Close any previous socket
    if (socket) {
      console.log("🧹 [SOCKET] Cleaning previous connection...");
      isManuallyClosed = true;
      socket.close();
      socket = null;
    }

    // Get token
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("❌ [SOCKET] No access token found");
      dispatch(setSocketError("Missing access token"));
      return;
    }

    
    const wsUrl = `wss://medtrax.me/ws/chat/${roomId}/?token=${token}`;
    console.log(`🔗 [SOCKET] Connecting to: ${wsUrl}`);

    socket = new WebSocket(wsUrl);
    currentRoomId = roomId;
    isManuallyClosed = false;

    socket.onopen = () => {
      console.log(`✅ [SOCKET] Connected to room ${roomId}`);
      dispatch(setSocketConnected(roomId));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 [SOCKET] Received:", data);

        if (data.type === "connection_established") {
          console.log("📥 [SOCKET] Connection established with backend");
          console.log("📜 Message history:", data.messages?.length || 0);
          return;
        }

        if (data.type === "appointment_completed") {
          console.warn("⚠ [SOCKET] Appointment completed - chat closing...");
          dispatch(setSocketError("Appointment ended"));

          window.dispatchEvent(
            new CustomEvent("appointmentCompleted", {
              detail: {
                appointmentId: data.appointment_id,
                status: data.status,
                message: data.message,
              },
            })
          );

          setTimeout(() => {
            if (socket) socket.close(4006);
          }, 1000);

          return;
        }

        if (data.type === "chat_message") {
          const msg = data.message;
          console.log("💬 [SOCKET] New message:", msg);

          dispatch(
            addMessageToCurrentChat({
              id: msg.id,
              sender_id: msg.sender_id,
              sender: {
                id: msg.sender_id,
                username: msg.sender_username,
                full_name: msg.sender_full_name,
                role: msg.sender_role,
              },
              sender_role: msg.sender_role,
              content: msg.content,
              timestamp: msg.timestamp,
              is_read: msg.is_read,
            })
          );
        }
      } catch (e) {
        console.error("❌ [SOCKET] Message parse error:", e);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ [SOCKET] Error:", error);
      dispatch(setSocketError("WebSocket connection error"));
    };

    socket.onclose = (event) => {
      console.log(
        `🔌 [SOCKET] Closed (Code=${event.code}, Reason=${event.reason || "none"})`
      );

      switch (event.code) {
        case 4004:
          dispatch(setSocketError("Chat room not found"));
          break;
        case 4001:
          dispatch(setSocketError("Authentication failed"));
          alert("⚠ Session expired. Please login again.");
          break;
        case 4003:
          dispatch(setSocketError("Not authorized"));
          alert("⚠ You don't have access to this chat.");
          break;
        case 4005:
          dispatch(setSocketError("Chat room inactive"));
          alert("⚠ This chat is no longer active.");
          break;
        case 4006:
          dispatch(setSocketError("Appointment ended"));
          alert("⏰ The appointment has ended. Chat closed.");
          break;
        default:
          if (!isManuallyClosed && event.code !== 1000) {
            dispatch(setSocketError(`Socket closed with code ${event.code}`));
          }
      }

      dispatch(setSocketDisconnected());
      socket = null;
      currentRoomId = null;
    };
  } catch (err) {
    console.error("💥 [SOCKET] Critical error:", err);
    dispatch(setSocketError("Critical WebSocket failure"));
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log(`🔌 [SOCKET] Manually disconnecting from room ${currentRoomId}`);
    isManuallyClosed = true;
    socket.close();
  }
  socket = null;
  currentRoomId = null;
};
export const sendSocketMessage = (message) => {
  if (!socket) {
    console.error("❌ [SOCKET] No active socket");
    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.error(
      `❌ [SOCKET] Cannot send, state = ${socket.readyState}`
    );
    return;
  }

  console.log("📤 [SOCKET] Sending message:", message);
  socket.send(JSON.stringify({ message }));
};

// Getters
export const getSocket = () => socket;
export const getCurrentRoomId = () => currentRoomId;