import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../../components/Layout/ChatLayout";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import {
  connectSocketAction,
  disconnectSocketAction,
  sendLiveMessage,
} from "../../redux/features/socketSlice";
import { fetchChatDoctors, fetchChatHistory } from "../../redux/features/chatSlice";
//import AiChatModal from "../shared/AiChatModal";

const PatientChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatDoctors, currentChat } = useSelector((state) => state.chat);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(connectSocketAction(user.id));
      dispatch(fetchChatDoctors());
    }
    return () => dispatch(disconnectSocketAction());
  }, [dispatch, user?.id]);

  const handleSelectChat = (chat) => {
    if (chat.id) dispatch(fetchChatHistory(chat.id));
  };

  const handleSendMessage = async (text, receiverId) => {
    dispatch(sendLiveMessage({ sender: user.id, receiver: receiverId, text }));
    if (receiverId)
      await axiosInstance.post(`/chat/rooms/${receiverId}/messages/`, {
        content: text,
      });
  };

  const sidebarItems = [
    { label: "Dashboard", to: "/patient/dashboard", icon: "🏠" },
    { label: "Appointment", to: "/patient/appointments", icon: "📅" },
    { label: "Chat", to: "/patient/chats", icon: "💬" },
    { label: "Blogs", to: "/patient/community", icon: "📝" },
    { label: "Profile", to: "/patient/profile", icon: "👤" },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="patient">
      <ChatLayout
        role="patient"
        userName={`${user?.first_name || ""} ${user?.last_name || ""}`}
        doctors={chatDoctors}
        patients={[]}
        currentChat={currentChat}
        onSelectChat={handleSelectChat}
        onSendMessage={handleSendMessage}
        onOpenAiChat={() => setShowAiModal(true)}
      />
      {showAiModal && <AiChatModal onClose={() => setShowAiModal(false)} />}
    </DashboardLayout>
  );
};

export default PatientChat;
