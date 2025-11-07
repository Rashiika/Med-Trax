import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";

// --- REST API chat actions ---
import {
  fetchChatDoctors,
  fetchConversations,
  fetchUnreadCount,
} from "../../redux/features/chatSlice";

// --- WebSocket actions ---
import {
  connectSocketAction,
  disconnectSocketAction,
  sendLiveMessage,
} from "../../redux/features/socketSlice";

const PatientChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatDoctors, conversations, loading } = useSelector(
    (state) => state.chat
  );
  const { liveMessages, isConnected } = useSelector((state) => state.socket);

  // --- 1️⃣ Connect WebSocket + Load Data ---
  useEffect(() => {
    if (user?.id) {
      // connect socket
      dispatch(connectSocketAction(user.id));

      // load doctors + past conversations
      dispatch(fetchChatDoctors());
      dispatch(fetchConversations());
      dispatch(fetchUnreadCount());
    }

    return () => {
      dispatch(disconnectSocketAction());
    };
  }, [dispatch, user?.id]);

  // --- 2️⃣ Message sending handler ---
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

    dispatch(sendLiveMessage(message));
  };

  // --- 3️⃣ Render ---
  return (
    <div className="p-4">
      <ChatLayout
        role="patient"
        userName={`${user?.first_name || "Patient"} ${user?.last_name || ""}`}
        doctors={chatDoctors}
        conversations={conversations}
        liveMessages={liveMessages}
        onSendMessage={handleSendMessage}
        loading={loading}
      />
    </div>
  );
};

export default PatientChat;
