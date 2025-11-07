import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";

// --- REST chat API actions (you already have these) ---
import {
  fetchChatDoctors,
  fetchChatPatients,
  fetchConversations,
  fetchUnreadCount,
} from "../../redux/features/chatSlice";

// --- WebSocket actions ---
import {
  connectSocketAction,
  disconnectSocketAction,
  sendLiveMessage,
} from "../../redux/features/socketSlice";

const DoctorChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatDoctors, chatPatients, conversations, loading } = useSelector(
    (state) => state.chat
  );
  const { liveMessages, isConnected } = useSelector((state) => state.socket);

  // --- 1️⃣ Connect WebSocket & Load initial chat data ---
  useEffect(() => {
    if (user?.id) {
      // Connect WebSocket
      dispatch(connectSocketAction(user.id));

      // Fetch initial chat lists
      dispatch(fetchChatDoctors());
      dispatch(fetchChatPatients());
      dispatch(fetchConversations());
      dispatch(fetchUnreadCount());
    }

    // Disconnect socket when leaving the page
    return () => {
      dispatch(disconnectSocketAction());
    };
  }, [dispatch, user?.id]);

  // --- 2️⃣ Handle Sending a Message (example handler for ChatLayout) ---
  const handleSendMessage = (text, receiverId) => {
    if (!isConnected) {
      console.warn("Socket not connected yet.");
      return;
    }

    const message = {
      sender: user?.id,
      receiver: receiverId,
      text,
      timestamp: new Date().toISOString(),
    };

    dispatch(sendLiveMessage(message)); // triggers WebSocket send
  };

  // --- 3️⃣ Pass all required props to ChatLayout ---
  return (
    <div className="p-4">
      <ChatLayout
        role="doctor"
        userName={`${user?.first_name || "Doctor"} ${user?.last_name || ""}`}
        doctors={chatDoctors}
        patients={chatPatients}
        conversations={conversations}
        liveMessages={liveMessages}
        onSendMessage={handleSendMessage}
        loading={loading}
      />
    </div>
  );
};

export default DoctorChat;
