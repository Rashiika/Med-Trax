let socketInstance = null;

export const connectSocket = (userId) => {
  const socketUrl = `ws://localhost:8000/ws/chat/${userId}/`;

  socketInstance = new WebSocket(socketUrl);

  socketInstance.onopen = () => {
    console.log("✅ WebSocket connected for user:", userId);
  };

  socketInstance.onmessage = (event) => {
    console.log("📩 Message received:", event.data);
  };

  socketInstance.onclose = () => {
    console.log("❌ WebSocket disconnected");
  };

  socketInstance.onerror = (error) => {
    console.error("⚠️ WebSocket error:", error);
  };

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.close();
    socketInstance = null;
    console.log("🛑 WebSocket connection closed manually");
  }
};
